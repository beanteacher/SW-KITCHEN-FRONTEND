import AdminChoiceInput, { type Props as ChoiceProps } from "./AdminChoiceInput";

type Props = Omit<ChoiceProps, "type">;

export default function AdminRadio(props: Props) {
  return <AdminChoiceInput type="radio" {...props} />;
}
