import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatus, deleteOrder, createOrder } from "../redux/ordersSlice";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import {Table} from "../components/ui/Table"
import {Button}  from "../components/ui/Button"
import {DropdownMenu} from "../components/ui/DropdownMenu"
import { Modal} from "../components/ui/Modal"

import { formatDate, isDelayed } from "../utils/helpers";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const [modalOpen, setModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ material: "", workstation: "", priority: "Low" });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCreateOrder = () => {
    dispatch(createOrder(newOrder));
    setModalOpen(false);
  };

  const orderStatusData = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.keys(orderStatusData).map((key) => ({ name: key, value: orderStatusData[key] }));

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      {user.role === "Manager" && (
        <Button onClick={() => setModalOpen(true)}>Create Order</Button>
      )}
      <Table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Workstation</th>
            <th>Status</th>
            <th>End Date</th>
            {user.role === "Operator" && <th>Actions</th>}
            {user.role === "Manager" && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={isDelayed(order.endDate) ? "bg-red-200" : ""}>
              <td>{order.material}</td>
              <td>{order.workstation}</td>
              <td>
                {user.role === "Operator" ? (
                  <DropdownMenu
                    options={["Pending", "In Progress", "Completed"]}
                    selected={order.status}
                    onChange={(status) => dispatch(updateOrderStatus({ id: order.id, status }))}
                  />
                ) : (
                  order.status
                )}
              </td>
              <td>{formatDate(order.endDate)}</td>
              {user.role === "Operator" && <td><Button>Log Material Usage</Button></td>}
              {user.role === "Manager" && <td><Button onClick={() => dispatch(deleteOrder(order.id))}>Delete</Button></td>}
            </tr>
          ))}
        </tbody>
      </Table>
      <PieChart width={400} height={300}>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Create New Order</h3>
        <input placeholder="Material" onChange={(e) => setNewOrder({ ...newOrder, material: e.target.value })} />
        <input placeholder="Workstation" onChange={(e) => setNewOrder({ ...newOrder, workstation: e.target.value })} />
        <Button onClick={handleCreateOrder}>Submit</Button>
      </Modal>
    </div>
  );
};

export default Dashboard;
