import ChoiceInput, { type Props as ChoiceProps } from "./ChoiceInput";

type Props = Omit<ChoiceProps, "type">;

export default function Radio(props: Props) {
  return <ChoiceInput type="radio" {...props} />;
}
