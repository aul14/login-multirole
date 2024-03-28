import React from 'react'

const Login = () => {
    return (
        <section className="hero has-background-gray-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <form className='box'>
                                <h1 className='title is-2'>Sign In</h1>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input type="text" placeholder='Email' className="input" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <input type="password" placeholder='******' className="input" />
                                    </div>
                                </div>
                                <div className="field mt-3">
                                    <button className="button is-primary is-fullwidth">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
