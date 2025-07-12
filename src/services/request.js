import instance from "./axios.js";
import LoadingService from "./Loading";

// Custom notification function (to be overridden by components)
let notify = ({ type, title, message }) => {
  console.log(`Notification:`);
};

const request = {
  // Allow components to set a custom notification handler
  setNotifyHandler(handler) {
    notify = handler;
  },

  get: (url, options = {}) => {
    return new Promise((resolve, reject) => {
      LoadingService.show();
      instance
        .get(url, options)
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(new Error("No data found"));
          }
        })
        .catch((e) => {
          notify({
            type: "error",
            title: "خطأ",
            message: e.message || "فشل في جلب البيانات",
          });
          reject(e);
        })
        .finally(() => {
          LoadingService.hide();
        });
    });
  },

  post: (url, payload, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!url.includes("search")) {
        LoadingService.show();
      }
      instance
        .post(url, payload, options)
        .then((res) => {
          if (res.data) {
            if (url.includes("search") || url.includes("paginate")) {
              resolve(res.data);
            } else {
              notify({
                type: "success",
                title: "نجاح",
                message: res?.data?.msg || "تم الإرسال بنجاح",
              });
              resolve(res.data);
            }
          } else {
            notify({
              type: "error",
              title: "خطأ",
              message: res?.data?.msg || "فشل الإرسال",
            });
            reject(new Error("No data returned"));
          }
        })
        .catch((e) => {
          if (!url.includes("search")) {
            notify({
              type: "error",
              title: "خطأ",
              message: e.message || "فشل الإرسال",
            });
          }
          reject(e);
        })
        .finally(() => {
          if (!url.includes("search")) {
            LoadingService.hide();
          }
        });
    });
  },

  put: (url, payload, options = {}) => {
    return new Promise((resolve, reject) => {
      LoadingService.show();
      instance
        .put(`${url}`, payload, options)
        .then((res) => {
          if (res.data) {
            notify({
              type: "success",
              title: "نجاح",
              message: "تم التعديل بنجاح",
            });
            resolve(res.data);
          } else {
            notify({
              type: "warn",
              title: "تنبيه",
              message: res?.data?.msg || "فشل التعديل",
            });
            reject(new Error("No data returned"));
          }
        })
        .catch((e) => {
          notify({
            type: "error",
            title: "خطأ",
            message: e.message || "فشل التعديل",
          });
          reject(e);
        })
        .finally(() => {
          LoadingService.hide();
        });
    });
  },

  delete: (url, options = {}) => {
    return new Promise((resolve, reject) => {
      // Use a custom confirm handler (to be set by component)
      notify({
        type: "confirm",
        title: "هل أنت متأكد؟",
        message: "لن تستطيع استعادة العنصر بعد الحذف!",
        callback: (confirmed) => {
          if (confirmed) {
            LoadingService.show();
            instance
              .delete(`${url}`, options)
              .then((res) => {
                if (res?.data?.status) {
                  notify({
                    type: "success",
                    title: "نجاح",
                    message: "تم الحذف بنجاح",
                  });
                  resolve(res.data);
                } else {
                  notify({
                    type: "error",
                    title: "خطأ",
                    message: res?.data?.msg || "فشل الحذف",
                  });
                  reject(new Error("Delete failed"));
                }
              })
              .catch((e) => {
                notify({
                  type: "error",
                  title: "خطأ",
                  message: e.message || "فشل الحذف",
                });
                reject(e);
              })
              .finally(() => {
                LoadingService.hide();
              });
          } else {
            reject(new Error("Deletion cancelled"));
          }
        },
      });
    });
  },
};

export default request;
