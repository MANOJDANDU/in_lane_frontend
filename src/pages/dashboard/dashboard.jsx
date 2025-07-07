import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import {
  Container,
  Form,
  Table,
  Button,
} from 'react-bootstrap';
import { Modal } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const firstDay = new Date();
        firstDay.setDate(1);
        const first = firstDay.toISOString().split('T')[0];

        setStartDate(first);
        setEndDate(today);
        fetchUsers('', first, today);
    }, []);

    const fetchUsers = (name, start, end) => {
        const token = localStorage.getItem('authToken');
        const _id = localStorage.getItem('_id');
        const params = {
            startDate: start,
            endDate: end,
        };
        if (name) params.name = name;
        setLoading(true)
        axios.get('http://localhost:8001/api/admin/user/list', {
            params,
            headers: {
                authtoken: `${token}`,
            },
        })
        .then((res) => setUsers(res.data.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    };

    const handleSearch = () => {
        if (startDate && endDate) {
            fetchUsers(name, startDate, endDate);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setSelectedStatus(user.isVerified);
        setIsModalOpen(true);
    };

    const handleSaveStatus = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const _id = localStorage.getItem('_id');
            console.log("------_id-----",token, _id)
            const res = await axios.patch(
            `http://localhost:8001/api/admin/user/update/status/${selectedUser._id}`,
            {
                verifiedBy: _id,
                isVerified: selectedStatus,
                notes: notes
            },
            {
                headers: {
                    authtoken: `${token}`,
                },
            }
            );

            fetchUsers(name, startDate, endDate);
            toast.success(res.data.message);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status');
        }
    };


  return (
    <Container className="dashboard-container">
        <h3 className="dashboard-title">Admin Dashboard</h3>

        <div className="dashboard-form-wrapper">
            <Form className="dashboard-form">
            <Form.Group className="dashboard-input-group">
            <Form.Control
                type="text"
                placeholder="Search by name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dashboard-input"
            />
          </Form.Group>

          <Form.Group className="dashboard-input-group">
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="dashboard-input"
                />
          </Form.Group>

          <Form.Group className="dashboard-input-group">
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="dashboard-input"
                />
            </Form.Group>

            <Button className="dashboard-button" onClick={handleSearch}>
                Search
            </Button>
            </Form>
        </div>

        <Table bordered hover responsive className="dashboard-table text-center">
            <thead className="dashboard-table-head">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
            </tr>
            </thead>
        <tbody>
            {users.length > 0 ? (
                users.map((user) => (
                <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                    <Button variant="primary" size="sm" onClick={() => handleView(user)}>
                        View
                    </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4" className="dashboard-empty-text">
                    No users found
                </td>
                </tr>
            )}
        </tbody>
        </Table>
        {loading && (
            <div
            style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(215, 214, 214, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
            }}
            >
            <Spinner animation="border" variant="primary" />
            </div>
        )}
        <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            >
            {selectedUser && (
                <div className="dashboard-user-details">
                <p><strong>Name:</strong> {selectedUser.fullname}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                <p><strong>DOB:</strong> {new Date(selectedUser.dob).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {selectedUser.address}</p>
                <p>
                    <strong>Status:</strong>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ marginLeft: '10px', padding: '4px 10px', borderRadius: '5px' }}
                    >
                        {selectedUser?.isVerified === "PENDING" && (
                            <option value="PENDING" disabled>
                                Pending
                            </option>
                        )}
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </p>
                <p>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add optional remarks..."
                        rows={3}
                        className="dashboard-notes-textarea"
                    />
                </p>

                <p><strong>User ID:</strong> {selectedUser.userId}</p>
                <p>
                    <strong>Aadhar:</strong><br />
                    <a href={selectedUser.aadhaar} target="_blank" rel="noopener noreferrer">
                        View Document
                    </a>
                </p>

                <p><strong>Photograph:</strong><br />
                    <img src={selectedUser.photograph} alt="Photograph" width={80} />
                </p>
                <p><strong>Signature:</strong><br />
                    <img src={selectedUser.signature} alt="Signature" width={80} />
                </p>

                <button onClick={handleSaveStatus} className="dashboard-save-btn">
                    Save
                </button>

                </div>
            )}
        </Modal>
        <ToastContainer position="top-center" />
    </Container>
  );
}

export default UserDashboard;
