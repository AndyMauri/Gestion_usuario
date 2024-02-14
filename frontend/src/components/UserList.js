import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Typography, message, Button, Card, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewUserRowVisible, setIsNewUserRowVisible] = useState(false);
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
    setIsNewUserRowVisible(true); // Mostrar la fila para el nuevo usuario
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('http://localhost:3000/users', values);
      message.success('User added successfully');
      setIsModalVisible(false);
      setIsNewUserRowVisible(false); // Ocultar la fila para el nuevo usuario después de agregarlo
      fetchData(); // Refrescar la lista después de crear el usuario
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Error adding user');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsNewUserRowVisible(false); // Ocultar la fila para el nuevo usuario si se cancela
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    setEditingKey(record.id);
    setEditingUser(record);
    form.setFieldsValue(record);
  };

  const cancel = () => {
    setEditingKey('');
    setEditingUser(null);
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      if (id === 'new') {
        await axios.post('http://localhost:3000/users', row);
        message.success('User added successfully');
        fetchData(); // Actualizar la lista después de crear el usuario
        setIsNewUserRowVisible(false); // Ocultar la fila para el nuevo usuario después de agregarlo
      } else {
        await axios.put(`http://localhost:3000/users/${id}`, row);
        message.success('User updated successfully');
      }
      setEditingKey('');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Error updating user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('User deleted successfully');
      fetchData(); // Actualizar la lista después de eliminar el usuario
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="name" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.name : ''} /> {/* Usar el valor del usuario en edición */}
          </Form.Item>
        ) : (
          <Text>{record.name}</Text>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="email" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.email : ''} /> {/* Usar el valor del usuario en edición */}
          </Form.Item>
        ) : (
          <Text>{record.email}</Text>
        );
      },
    },
    {
      title: 'Age',
      dataIndex: 'age',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="age" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.age : ''} /> {/* Usar el valor del usuario en edición */}
          </Form.Item>
        ) : (
          <Text>{record.age}</Text>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type="primary" onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button onClick={() => edit(record)}>Edit</Button>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: "url('https://via.placeholder.com/800')" }}>
      <Card style={{ width: '80%', opacity: 0.9 }}>
        {isNewUserRowVisible && ( // Mostrar la fila para el nuevo usuario solo cuando es visible
          <Form form={form} onFinish={handleOk} layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item name="name" style={{ margin: 0 }}>
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name="email" style={{ margin: '0 8px' }}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="age" style={{ margin: 0 }}>
              <Input placeholder="Age" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Save</Button>
            </Form.Item>
          </Form>
        )}
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{ marginBottom: '20px' }}
          onClick={showModal}
        />
        <Table
          bordered
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Add User"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please input the age' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserList;
