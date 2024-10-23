const postDeleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name = productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name = _csrf]").value;
  const productElement = btn.closest("article");
  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
};
