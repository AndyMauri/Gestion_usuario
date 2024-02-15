import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Form, Input, Button, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error fetching users');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditingUser(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        await axios.put(`http://localhost:3000/users/${editingUser.id}`, values);
        message.success('User updated successfully');
      } else {
        await axios.post('http://localhost:3000/users', values);
        message.success('User added successfully');
      }

      setIsModalVisible(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error('Error adding/updating user:', error);
      message.error('Error adding/updating user');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const editUser = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Editar',
      key: 'edit',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" shape="circle" icon={<EditOutlined />} onClick={() => editUser(record)} />
        </Space>
      ),
    },
    {
      title: 'Borrar',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)} />
        </Space>
      ),
    },
  ];

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: "url('https://via.placeholder.com/800')" }}>
      <Card style={{ width: '80%', opacity: 0.9 }}>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} style={{ marginBottom: '20px' }} onClick={showModal} />
        <Table dataSource={users} columns={columns} />
        <Modal
          title={editingUser ? 'Edit User' : 'Add User'}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} name="addEditUserForm">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter the email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="age"
              label="Age"
              rules={[{ required: true, message: 'Please enter the age' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserList;
