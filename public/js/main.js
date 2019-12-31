const elem = document.querySelector(".delete-article");
const id = elem.dataset.id;

elem.onclick = e => {
  axios
    .delete("/articles/" + id)
    .then(response => {
      // console.log(response);
      alert("Deleted...");
      window.location.href = "/";
    })
    .catch(err => {
      console.log(err);
    });
};
