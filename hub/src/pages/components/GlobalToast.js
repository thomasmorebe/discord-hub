import { Component, useState } from "react";
import { ToastService } from "../../_services/toastService";
import { Toast, ToastContainer } from "react-bootstrap";

class GlobalToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
        toasts: [],
    };
  }

  componentDidMount() {
    ToastService.onToast()
    .subscribe(toast => {
        toast.show = true;
        this.addToast(toast);
    });
  }

  addToast(toast) {
    toast.id = this.state.counter;
    this.setState({
        counter: this.state.counter + 1,
        toasts: [...this.state.toasts, toast],
    });
  }

  removeToast(id) {
    this.setState({
        toasts: this.state.toasts.filter(toast => toast.id !== id),
    });
  }


  render() {
    return (
      <div className="position-relative" style={{zIndex: 999}}>
          <ToastContainer position="top-center">
          {this.state.toasts.map(toast => (
            <Toast onClose={() => this.removeToast(toast.id)} show={toast.show} delay={10000} key={toast.id} autohide>
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
}

export default GlobalToast;