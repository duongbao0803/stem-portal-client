import React, { useState } from "react";
import { Button, Input, Table, Tag } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { AppstoreAddOutlined, FilterOutlined } from "@ant-design/icons";
import useProductService from "@/services/productService";
import ExportButton from "./ExportProduct";
import DropdownFunction from "./DropdownFunction";
import AddProductModal from "./AddProductModal";
import useBrandService from "@/services/brandService";
import { Dayjs } from "dayjs";

export interface DataType {
  _id: string;
  key: string;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
  brand: string;
  origin: string;
  expireDate: string | number | Date | Dayjs | null | undefined;
}

const ProductList: React.FC = () => {
  const { products, isFetching } = useProductService();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { brands } = useBrandService();

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  const getBrandNameById = (brandId: string) => {
    const brand = brands?.find(
      (brand: { _id: string }) => brand?._id === brandId,
    );
    return brand ? brand?.brandName : "N/A";
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
      className: "first-column",
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      render: (image) => (
        <img
          src={image}
          alt="Avatar"
          className="h-[100px] w-[100px] rounded-[100%] object-cover"
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "25%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "2%",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      width: "5%",
      render: (brandId: string) => getBrandNameById(brandId),
    },
    {
      title: "Origin",
      dataIndex: "origin",
      width: "13%",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "10%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        let color;
        switch (status) {
          case "AVAILABLE":
            color = "green";
            break;
          case "EXPIRE":
            color = "red";
            break;
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },

    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <>
          <DropdownFunction productInfo={record} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-x-2">
          <Input
            placeholder="Search by..."
            className="h-8 max-w-lg rounded-lg sm:mb-5 sm:w-[300px]"
          />
          <Button className="flex items-center" type="primary">
            <FilterOutlined className="align-middle" />
            Sort
          </Button>
        </div>
        <div className="flex gap-x-2">
          <div>
            <ExportButton />
          </div>
          <div>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              <div className="flex justify-center">
                <AppstoreAddOutlined className="mr-1 text-lg" /> Add Product
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Table
        className="pagination"
        id="myTable"
        columns={columns}
        dataSource={products?.map((record: { id: unknown }) => ({
          ...record,
          key: record.id,
        }))}
        pagination={{
          current: currentPage,
          total: products.totalProducts || 0,
          pageSize: 5,
        }}
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(record) => record._id}
      />
      <AddProductModal setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
};

export default ProductList;
