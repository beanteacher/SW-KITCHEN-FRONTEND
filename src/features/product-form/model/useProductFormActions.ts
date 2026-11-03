"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { ProductApi, productKeys, type ProductDto } from "@/entities/product";
import { toApiError, type ApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { countFieldErrors, toProductFormPath } from "../lib/productFormErrors";
import { toFormValues, toSaveForm } from "../lib/productFormValues";
import { ProductSchema } from "./schema/productSchema";
import { UPLOAD_IMAGE_KEY, useCreateProduct, useEditProduct } from "./useProductFormQueries";

type FormValues = ProductSchema.FormValues;

// 화면 위쪽 빨강 알림. reload 면 [다시 불러오기] 를 붙인다
export interface SaveAlert {
  message: string;
  reload?: boolean;
}

const LIST_PATH = "/admin/product";
const LEAVE_MESSAGE = "저장하지 않은 내용이 있습니다. 나갈까요?";

// 서버가 칸을 알려 주지 않은 실패를 위쪽 알림 문구로. 저장은 전부 되거나 전부 안 된다
function toSaveAlert(error: ApiError): SaveAlert {
  if (error.code === "CONCURRENT_MODIFICATION") {
    return {
      message:
        "다른 담당자나 주문이 이 제품의 재고를 먼저 바꿨습니다. 아무것도 저장하지 않았습니다. 다시 불러오면 지금 고친 내용은 사라집니다. 고친 내용을 적어 둔 뒤 다시 불러와 주세요.",
      reload: true,
    };
  }
  if (error.status === 0 || error.status >= 500) {
    return { message: "저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
  }
  const undo =
    error.code === "OPTION_IN_USE" ? " 그 옵션의 [되돌리기]를 누른 뒤 다시 저장해 주세요." : "";
  return { message: `${error.message} 아무것도 저장하지 않았습니다.${undo}` };
}

// 제품 등록·수정 화면의 폼과 상태. product 가 있으면 수정 화면이다
export function useProductFormActions(initialProduct?: ProductDto.AdminDetail) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 등록하고 나면 같은 화면이 그 제품의 수정 화면이 된다
  const [product, setProduct] = useState(initialProduct);
  // 다시 채울 때 올려 구역 안 화면 상태(고른 대분류, 펼친 줄 등)도 새로 시작한다
  const [formKey, setFormKey] = useState(0);
  const [alert, setAlert] = useState<SaveAlert | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ProductSchema.ProductFormSchema),
    defaultValues: toFormValues(initialProduct),
  });
  const { mutate: create, isPending: isCreating } = useCreateProduct();
  const { mutate: edit, isPending: isEditing } = useEditProduct();
  const isUploading = useIsMutating({ mutationKey: UPLOAD_IMAGE_KEY }) > 0;
  const { isDirty, errors } = form.formState;

  // 고친 게 있으면 창을 닫거나 새로 고칠 때 브라우저가 확인을 띄운다
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const isEdit = product !== undefined;
  // 판매 구분을 잠글지 보는 데 쓴다. 등록 화면은 셋 다 고를 수 있다
  const originalSalesType = product?.salesType ?? null;
  const hasReserved = (product?.options ?? []).some((option) => (option.reservedQty ?? 0) > 0);

  // 서버가 돌려준 제품으로 화면을 다시 채운다 (새 상품 코드·version)
  const fillWith = (next: ProductDto.AdminDetail) => {
    setProduct(next);
    form.reset(toFormValues(next));
    setFormKey((key) => key + 1);
  };

  const handleSaveError = (error: unknown, optionIndexes: number[]) => {
    const apiError = toApiError(error);
    if (apiError.fieldErrors.length === 0) {
      setAlert(toSaveAlert(apiError));
      window.scrollTo(0, 0);
      return;
    }
    apiError.fieldErrors.forEach(({ field, message }, index) => {
      // ponytail: 서버 칸 경로를 폼 경로로 바꾼 값이 폼에 있는 칸이라고 믿는다. 없는 칸이면 오류가 화면에 안 보인다
      const name = toProductFormPath(field, optionIndexes) as FieldPath<FormValues>;
      form.setError(name, { type: "server", message }, { shouldFocus: index === 0 });
    });
  };

  // 화면 검사를 먼저 하고, 틀리면 보내지 않는다 (첫 오류 칸으로 커서는 react-hook-form 이 옮긴다)
  const handleSave = form.handleSubmit((values) => {
    setAlert(null);
    const { data, optionIndexes } = toSaveForm(values);
    const onError = (error: unknown) => handleSaveError(error, optionIndexes);

    if (product) {
      edit(
        { id: product.id, data },
        {
          onSuccess: (saved) => {
            fillWith(saved);
            setSavedOpen(true);
          },
          onError,
        },
      );
      return;
    }
    create(data, {
      onSuccess: (saved) => {
        // 화면은 그대로 두고 주소만 수정 화면으로 바꾼다. 새로 고치면 수정 화면이 열린다
        window.history.replaceState(null, "", `${LIST_PATH}/${saved.id}/edit`);
        fillWith(saved);
        setSavedOpen(true);
      },
      onError,
    });
  });

  const handleReload = async () => {
    if (!product) return;
    try {
      const fresh = await queryClient.fetchQuery({
        queryKey: productKeys.adminDetail(product.id),
        queryFn: () => ProductApi.adminDetail(product.id),
        staleTime: 0,
      });
      fillWith(fresh);
      setAlert(null);
      toast("다시 불러왔습니다.");
    } catch {
      toast("다시 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.", "error");
    }
  };

  // ponytail: [취소]·[목록으로] 만 확인을 띄운다. 왼쪽 메뉴 링크로 나가는 것은 아직 막지 않는다
  // ponytail: 관리 목록의 검색 조건은 아직 이어받지 않는다. 관리 목록 화면을 만들 때 붙인다
  const handleLeave = () => {
    if (isDirty && !window.confirm(LEAVE_MESSAGE)) return;
    router.push(LIST_PATH);
  };

  return {
    form,
    formKey,
    product,
    isEdit,
    originalSalesType,
    hasReserved,
    alert,
    savedOpen,
    errorCount: countFieldErrors(errors),
    isUploading,
    isSaving: isCreating || isEditing,
    handleSave,
    handleReload,
    handleLeave,
    handleCloseSaved: () => setSavedOpen(false),
  };
}
