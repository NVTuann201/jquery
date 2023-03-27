// function
const showChucVu = () => {
  const chucVu = document.getElementsByClassName("chuc-vu")[0];
  chucVu.setAttribute("style", "display:block;");
};
const showEditPosition = (code, name, note, id) => {
  var editPosition = $(".edit-position");
  editPosition.css("display", "block");
  $("#ma-edit").val(code);
  $("#chuc-vu-edit").val(name);
  $("#thong-tin-edit").val(note);
  $("#btn-update").attr("id-update", id);
};

const getMe = (access_token) => {
  fetch("https://smartcheckingv2.howizbiz.com/api/auth/me", {
    method: "POST",
    headers: {
      authorization: "Bearer " + access_token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const name = data.data.name;
      message.innerHTML = "Xin chao: " + name;
      showChucVu();
    });
};

const getBirthday = (access_token) => {
  fetch("https://smartcheckingv2.howizbiz.com/api/dashboard/birthdays", {
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((result) => {
      const key = Object.keys(result.data);
      const data = result.data[key[0]];
      console.log(data);
      const table = document.getElementById("data-table");
      let dataTable = "<tr><th>Id</th><th>Name</th><th>Birthday</th></tr>";
      for (let i = 0; i < data.length; i++) {
        dataTable += `
            <tr>
              <td>${data[i].id}</td>
              <td>${data[i].name}</td>
              <td>${data[i].date_of_birth}</td>
            </tr>`;
      }
      table.innerHTML = dataTable;
    });
};
const getPosition = (access_token) => {
  const page = 1;
  const perPage = 10;
  fetch(
    `https://smartcheckingv2.howizbiz.com/api/position?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      headers: {
        authorization: "Bearer " + access_token,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("data chuc vu: ", data.data.data);
      showPosition(access_token, data.data.data);
    });
};
const showPosition = (access_token, data) => {
  const chucVu = document.getElementsByClassName("table-position")[0];
  let html =
    "<tr><th>STT</th><th>Ma</th><th>Ten</th><th>Mo ta</th><th>Hoat dong</th></tr>";
  data.forEach((val, index) => {
    // console.log('access token: ', access_token);
    const dataEdit = {
      code: val.code,
      name: val.name,
      note: val.note,
    };
    console.log("data edit: ", dataEdit);
    const row = `
    <tr>
      <td>${index + 1}</td>
      <td>${val.code}</td>
      <td>${val.name}</td>
      <td>${val.note}</td>
      <td>
        <button 
          onclick="showEditPosition('${val.code}','${val.name}','${
      val.note
    }', '${val.id}')" 
        >edit</button>
        <button onclick="deletePosition('${access_token}', ${
      val.id
    })">delete</button>
      </td>
    </tr>`;
    html += row;
  });
  chucVu.innerHTML = html;
};
const deletePosition = (access_token, id) => {
  $.ajax({
    url: `https://smartcheckingv2.howizbiz.com/api/position/${id}/delete`,
    method: "DELETE",
    headers: {
      authorization: "Bearer " + token,
    },
    success: function (response) {
      getPosition(token);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle any errors here
      console.error(textStatus, errorThrown);
    },
  });
};

// click method
const message = document.getElementById("message");
let token;
document.getElementById("btn-login").onclick = () => {
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  const data = {
    email,
    password,
  };
  fetch("https://smartcheckingv2.howizbiz.com/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      token = data.access_token;
      console.log(token);
      getMe(token);
      getBirthday(token);
      /////
      getPosition(token);
    });
};

document.getElementById("btn-add").onclick = () => {
  let id = document.getElementById("ma");
  let chucVu = document.getElementById("chuc-vu");
  let thongTin = document.getElementById("thong-tin");

  const data = {
    code: id.value,
    name: chucVu.value,
    note: thongTin.value,
  };

  fetch("https://smartcheckingv2.howizbiz.com/api/position/add", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code) {
        id.value = "";
        chucVu.value = "";
        thongTin.value = "";
        console.log("them: ", data);
        getPosition(token);
      }
    });
};

// document.getElementById("btn-update").onclick = () => {
//   const id = document.getElementById("btn-update").getAttribute("id-update");
//   const ma = document.getElementById("ma-edit");
//   const chucVu = document.getElementById("chuc-vu-edit");
//   const thongTin = document.getElementById("thong-tin-edit");

//   const dataEdit = {
//     code: ma.value,
//     name: chucVu.value,
//     note: thongTin.value,
//   };

//   fetch(`https://smartcheckingv2.howizbiz.com/api/position/${id}/edit`, {
//     method: "POST",
//     body: JSON.stringify(dataEdit),
//     headers: {
//       "Content-Type": "application/json",
//       authorization: "Bearer " + token,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.code === 200) {
//         console.log("update: ", data);
//         document
//           .getElementsByClassName("edit-position")[0]
//           .setAttribute("style", "display:none;");
//         getPosition(token);
//       }
//     });
// };

jQuery(function () {
  $("#huongkoi").on("click", function () {
    $.ajax({
      url: "https://smartcheckingv2.howizbiz.com/api/dashboard/birthdays",
      method: "GET",
      dataType: "json",
      headers: {
        authorization: "Bearer " + token,
      },
      success: function (response) {
        // Handle the response here
        console.log(response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle any errors here
        console.error(textStatus, errorThrown);
      },
    });
  });
  $("#btn-update").on("click", function (value) {
    const id = $("#btn-update").attr("id-update");
    const dataEdit = {
      code: $("#ma-edit").val(),
      name: $("#chuc-vu-edit").val(),
      note: $("#thong-tin-edit").val(),
    };
    $.ajax({
      url: `https://smartcheckingv2.howizbiz.com/api/position/${id}/edit`,
      method: "POST",
      data: JSON.stringify(dataEdit),
      contentType: "application/json",
      headers: {
        authorization: "Bearer " + token,
      },
      success: function (response) {
        // Handle the response here
        $(".edit-position").css("display", "none");
        getPosition(token);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle any errors here
        console.error(textStatus, errorThrown);
      },
    });
  });
});
