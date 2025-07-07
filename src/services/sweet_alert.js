import swal from "sweetalert2";
window.Swal = swal;

const responseAlert = (icon, title, text) => {
  swal.fire({
    title: title,
    text: text,
    icon: icon,
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 3000,
  });
};

export default responseAlert;