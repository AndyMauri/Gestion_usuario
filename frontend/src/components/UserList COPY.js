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
    setIsNewUserRowVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('http://localhost:3000/users', values);
      message.success('Usuario agregado exitosamente');
      setIsModalVisible(false);
      setIsNewUserRowVisible(false);
      fetchData();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      message.error('Error al agregar usuario');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsNewUserRowVisible(false);
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
      const { name, email, age } = row;

      const currentUser = users.find(user => user.id === id);

      if (!currentUser) {
        console.error('Usuario no encontrado');
        message.error('Usuario no encontrado');
        return;
      }

      if (name === currentUser.name && email === currentUser.email && age === currentUser.age) {
        message.error('No se detectaron cambios. Modifica al menos un campo.');
        return;
      }

      if (name !== currentUser.name || email !== currentUser.email || age !== currentUser.age) {
        if (id === 'new') {
          await axios.post('http://localhost:3000/users', row);
          message.success('Usuario agregado exitosamente');
          fetchData();
          setIsNewUserRowVisible(false);
        } else {
          await axios.put(`http://localhost:3000/users/${id}`, row);
          message.success('Usuario actualizado exitosamente');
        }
      }

      setEditingKey('');
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      message.error('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('Usuario eliminado exitosamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      message.error('Error al eliminar usuario');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="name" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.name : ''} />
          </Form.Item>
        ) : (
          <Text>{record.name}</Text>
        );
      },
    },
    {
      title: 'Correo electrónico',
      dataIndex: 'email',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="email" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.email : ''} />
          </Form.Item>
        ) : (
          <Text>{record.email}</Text>
        );
      },
    },
    {
      title: 'Edad',
      dataIndex: 'age',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="age" style={{ margin: 0 }}>
            <Input defaultValue={editingUser ? editingUser.age : ''} />
          </Form.Item>
        ) : (
          <Text>{record.age}</Text>
        );
      },
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type="primary" onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Guardar
            </Button>
            <Popconfirm title="¿Estás seguro de cancelar?" onConfirm={cancel}>
              <Button>Cancelar</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button onClick={() => edit(record)}>Editar</Button>
        );
      },
    },
    {
      title: 'Eliminar',
      dataIndex: 'delete',
      render: (_, record) => (
        <Popconfirm
          title="¿Estás seguro de eliminar este usuario?"
          onConfirm={() => handleDeleteUser(record.id)}
          okText="Sí"
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
        {isNewUserRowVisible && (
          <Form form={form} onFinish={handleOk} layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item name="name" style={{ margin: 0 }}>
              <Input placeholder="Nombre" />
            </Form.Item>
            <Form.Item name="email" style={{ margin: '0 8px' }}>
              <Input placeholder="Correo electrónico" />
            </Form.Item>
            <Form.Item name="age" style={{ margin: 0 }}>
              <Input placeholder="Edad" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Guardar</Button>
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
          title="Agregar Usuario"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: 'Por favor, ingresa el correo electrónico' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Edad" rules={[{ required: true, message: 'Por favor, ingresa la edad' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserList;