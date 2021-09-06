import { useEffect, useState } from "react";
import { ToastService } from "../../_services/toastService";
import { Toast, ToastContainer } from "react-bootstrap";

function GlobalToast() {
  const [toasts, setToasts] = useState([]);
  const [counter, setCounter] = useState(0);


  useEffect(() => {
    ToastService.onToast()
      .subscribe(toast => {
        toast.show = true;
        addToast(toast);
      });
  }, []);


  const addToast = (toast) => {
    toast.id = counter;
    setCounter(counter + 1);
  }
  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  }



  return (
    <div className="position-relative" style={{ zIndex: 999 }}>
      <ToastContainer position="top-center">
        {toasts.map(toast => (
          <Toast onClose={() => removeToast(toast.id)} show={toast.show} delay={10000} key={toast.id} autohide>
            <Toast.Header closeButton={true}>
              <strong className="me-auto">{toast.title || ""}</strong>
              <small>{toast.subtitle || ""}</small>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
}

export default GlobalToast;