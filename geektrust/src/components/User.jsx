import React, { useEffect, useState } from "react";
import "./User.css";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Pagination } from "antd";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchData, setSearchData] = useState("");

  // Pagination Start
  const [pageCount, setPageCount] = useState(0);
  console.log("Page Count:", pageCount);

  const itemPerPage = 10;
  // checking if the pageCount is greater than 0;
  let pageVisited = pageCount * itemPerPage;

  const totalPages = Math.ceil(users.length / itemPerPage);
  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  // pagination end

  useEffect(() => {
    getUsersDetails();
  }, []);
  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        console.log(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };
  //delete multiple users
  const deleteMultipleUsers = () => {
    console.log("Delete Multiple Users");
    let selectedUsers = document.getElementsByClassName("checkbox");
    let selectedUsersArray = [];
    for (let i = 0; i < selectedUsers.length; i++) {
      if (selectedUsers[i].checked) {
        selectedUsersArray.push(selectedUsers[i].value);
      }
    }
    console.log("Selected Users:", selectedUsersArray);

    let newUsers = users.filter((user) => {
      return !selectedUsersArray.includes(user.id);
    });
    setUsers(newUsers);
    console.log("New Users:", newUsers);
  };

  // Delete Data by Click
  const handleDelete = (ind) => {
    let filteredItem = users.filter((ele) => {
      // same thing filterOut object.id !==id
      return ele.id !== ind;
    });
    setUsers(filteredItem);
  };

  //Edit data by click
  const handleEdit = (ind) => {
    let filteredItem = users.filter((ele) => {
      // same thing filterOut object.id !==id
      return ele.id === ind;
    });
    setUsers(filteredItem);
  };

  console.log("PageVisited: ", pageVisited);
  return (
    <div className="container">
      <br />
      <input
        className="inputBox"
        type="text"
        name="name"
        placeholder=" Search by any field "
        onChange={(e) => setSearchData(e.target.value)}
      />

      <table className="table">
        <tr>
          <th></th>
          <th>Name </th>
          <th>Email </th>
          <th> Role</th>
          <th>Action</th>
        </tr>

        {users
          //Search Data by Input
          .filter((e) => {
            if (searchData === "") return e;
            else if (
              e.name.includes(searchData) ||
              e.email.includes(searchData) ||
              e.role.includes(searchData)
            ) {
              return e;
            }
          })
          .slice(pageVisited, pageVisited + itemPerPage)
          .map((e, ind) => (
            <tr key={e.id}>
              <input type="checkbox" className="checkbox" value={e.id} />

              <td> {e.name} </td>
              <td> {e.email} </td>
              <td> {e.role} </td>
              <td className="btn">
                <button
                  onClick={() => {
                    handleEdit(e.id);
                  }}
                >
                  {" "}
                  <AiFillEdit />{" "}
                </button>
                <button onClick={() => handleDelete(e.id)}>
                  {" "}
                  <AiFillDelete
                    style={{
                      color: "red",
                    }}
                  />{" "}
                </button>
              </td>
              <button onClick={() => deleteMultipleUsers(e.id)}>
                Delete Select
              </button>
            </tr>
          ))}
      </table>
      <br />
      <br />

      <ReactPaginate
        className="pagination"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={pageChange}
        containerClassName={<Pagination />}
      />
    </div>
  );
}

export default Users;
