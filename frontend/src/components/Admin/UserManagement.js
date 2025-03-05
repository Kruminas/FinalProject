import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const API_URL = '/api';
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Only admins can view content');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleBlock = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/block`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to block the user');
      alert('User was blocked');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnblock = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/unblock`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to unblock user');
      alert('User was unblocked');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      alert('User was deleted');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddAdmin = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/addAdmin`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to add admin');
      alert('User is now admin');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/removeAdmin`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to remove admin');
      alert('Admin rights was removed');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>User Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isBlocked ? 'Yes' : 'No'}</td>
              <td>
                {!u.isBlocked ? (
                  <Button variant="warning" className="me-2" onClick={() => handleBlock(u._id)}>
                    Block
                  </Button>
                ) : (
                  <Button variant="success" className="me-2" onClick={() => handleUnblock(u._id)}>
                    Unblock
                  </Button>
                )}
                <Button variant="info" className="me-2" onClick={() => handleAddAdmin(u._id)}>
                  Add Admin
                </Button>
                <Button variant="secondary" className="me-2" onClick={() => handleRemoveAdmin(u._id)}>
                  Remove Admin
                </Button>
                <Button variant="danger" onClick={() => handleDelete(u._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}