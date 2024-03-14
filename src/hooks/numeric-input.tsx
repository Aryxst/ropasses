export default function (
 e: InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
 },
) {
 const value = e.target.value.replace(/\D/g, '');
 if (value !== e.target.value) {
  e.target.value = value;
 }
}
