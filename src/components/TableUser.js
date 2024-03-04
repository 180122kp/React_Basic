import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import {fetchAllUser} from'../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './modalAddNew';
import ModalEditUser from './modalEditUser';
import ModalConfirm from './modalConfirm';
import  _ from"lodash";
const Tableusers = (props) => {
    const[listUsers,setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const[totalPages,setTotalPages] = useState(0);
    const[isShowModalAddNew,setIsShowModalAddNew] = useState(false);
    const[isShowEdit,setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});
    const [isShowModalDelete,setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});
    const handleClose = () => {
      setIsShowModalAddNew(false);
      setIsShowModalEdit(false);
      setIsShowModalDelete(false);
    }
    const handleUpdateTable = (user) => {
        setListUsers([user,...listUsers])
    }
    const handleEditUser = (user) => {
        setDataUserEdit(user);
        setIsShowModalEdit(true);
    }
    const handleEditUserModal = (user) => {
        let cloneListUser = _.cloneDeep(listUsers);
        let index = listUsers.findIndex(item => item.id === user.id);
        cloneListUser[index].first_name = user.first_name;
        setListUsers(cloneListUser);

    }

    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true);
        setDataUserDelete(user);
    }
    const handleDeleteFromModal = (user) => {
        let cloneListUser = _.cloneDeep(listUsers);
        cloneListUser = cloneListUser.filter(item => item.id !== user.id);
        setListUsers(cloneListUser);
    }
    const handleFilterName = () => {
        let cloneListUser = _.cloneDeep(listUsers);
        cloneListUser = cloneListUser.filter(item => item.first_name.length > 5);
        setListUsers(cloneListUser);
    }
    useEffect(() => {
        //call api
        getUsers(1);

    }, [])
    const getUsers = async (page) => {
        let res = await fetchAllUser(page);
        if(res && res.data) {
        console.log(res)
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages)
        }
    }
    const handlePageClick = (event) => {
        getUsers(+event.selected + 1);
    }
    return (<>
            <div className='my-3 add-new'>
          <span> <b>List User:</b></span>
          <button className='btn btn-success' onClick={() => handleFilterName()}>Lọc</button>
          <button className="btn btn-success" 
          onClick={()=>setIsShowModalAddNew(true)}> Add new user</button>
        </div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>FirsName</th>
          <th>Last Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && 
            listUsers.map((item,index) => {
                return (
                <tr key ={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                        <button 
                        className='btn btn-warning mx-3'
                        onClick={()=> handleEditUser(item)}
                        >Edit</button>
                        <button className='btn btn-danger'
                                onClick={() => handleDeleteUser(item)}
                        >Delete </button>
                    </td>
                </tr>
                )
            })
        }
        
      </tbody>
    </Table>
    <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
           <ModalAddNew show={isShowModalAddNew}
     handleClose={handleClose}
     handleUpdateTable={handleUpdateTable}/>
     <ModalEditUser
        show={isShowEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserModal={handleEditUserModal}
     />
     <ModalConfirm show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteFromModal = {handleDeleteFromModal}/>
    </>)
}
export default Tableusers;