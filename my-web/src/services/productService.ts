import axiosClient from './axiosClient';

// Định nghĩa kiểu dữ liệu (Interface) cho Product dựa trên những gì Backend trả về
export type CategoryType = 'Supplements' | 'Equipment' | 'Apparel' | 'Accessories' | 'Others'; // ... điền đủ 9 cái

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string; // Backend trả về link ảnh
  stockQuantity: number; // Mapping integer($int32) sang number là chuẩn
  category: string; // Hoặc sửa thành: category: CategoryType; nếu muốn chặt chẽ
}

const productService = {
  // GET /products
  getAllProducts: () => {
    return axiosClient.get<Product[]>('/products');
  },

  // GET /products/{id}
  getProductById: (id: number) => {
    return axiosClient.get<Product>(`/products/${id}`);
  },

  // POST /products (Tạo mới)
  createProduct: (data: Omit<Product, 'id'>) => {
    return axiosClient.post('/products', data);
  },

  // DELETE /products/{id}
  deleteProduct: (id: number) => {
    return axiosClient.delete(`/products/${id}`);
  }
};

export default productService;