function ModalDialogBackground(props) {
  function onClick() {
    if (props.onClick) props.onClick();
  }
  
  return <div className="modalDialogBackground" style={props.style} onClick={onClick}></div>;
}
export default ModalDialogBackground;
