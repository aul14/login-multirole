import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FormAddProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    }

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", file)
            formData.append("name", name)
            formData.append("price", price)
            await axios.post('http://localhost:5000/products', formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            navigate('/products');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }
    return (
        <div>
            <h1 className='title'>Products</h1>
            <h2 className='subtitle'>Add new product</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={saveProduct}>
                            <p className="has-text-centered">{msg}</p>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Product Name' className="input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Price</label>
                                <div className="control">
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Price' className="input" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Image</label>
                                <div className="control">
                                    <div className="file">
                                        <label className="file-label">
                                            <input type="file" className='file-input' onChange={loadImage} />
                                            <span className='file-cta'>
                                                <span className="file-label">Choose a file...</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {preview ? (
                                <figure className="image is-128x128 mb-4">
                                    <img src={preview} alt='Preview Image' />
                                </figure>
                            ) : ("")}
                            <div className="field">
                                <div className="control">
                                    <button type='submit' className="button is-primary">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormAddProduct
