import React from "react";
import "./Button.css";

type Props = Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "className">

export default function Button(props: Props) {
  return (
    <button {...props} className={"modal-btn" + (props.disabled ? " disabled" : "")} />
  );
}
