import ChoiceInput, { type Props as ChoiceProps } from "./ChoiceInput";

type Props = Omit<ChoiceProps, "type">;

export default function Checkbox(props: Props) {
  return <ChoiceInput type="checkbox" {...props} />;
}
