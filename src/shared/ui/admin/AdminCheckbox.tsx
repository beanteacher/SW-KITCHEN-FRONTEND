import AdminChoiceInput, { type Props as ChoiceProps } from "./AdminChoiceInput";

type Props = Omit<ChoiceProps, "type">;

export default function AdminCheckbox(props: Props) {
  return <AdminChoiceInput type="checkbox" {...props} />;
}
