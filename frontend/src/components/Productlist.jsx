import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Productlist = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProduct();
    }, [])

    const getProduct = async () => {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
    }

    const deleteProduct = async (productId) => {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        getProduct();
    }
    return (
        <div>
            <h1 className='title'>Products</h1>
            <h2 className='subtitle'>List of products</h2>
            <Link to={"/products/add"} className='button is-success mb-2'>Add New</Link>
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image Product</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.uuid}>
                            <td>{index + 1}</td>
                            <td><img src={product.url} className='image is-96x96' alt={product.name} /></td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.user.name}</td>
                            <td>
                                <Link to={`/products/edit/${product.uuid}`} className='button is-small is-info'>Edit</Link>
                                <button onClick={() => deleteProduct(product.uuid)} className='button is-small is-danger'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Productlist
