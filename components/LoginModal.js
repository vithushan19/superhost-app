import { useState } from "react"

const LoginModal = ({ showLoadingSpinner, onLoginSubmit }) => {
    const [email, setEmail] = useState("")

    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Login to Superhost</h3>
                <form id='loginform' onSubmit={(event) => { event.preventDefault(); onLoginSubmit(email) }}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Your Email</span>
                        </label>
                        <label className="input-group">
                            <span>Email</span>
                            <input type="text" placeholder="info@site.com" className="input input-bordered" value={email} onChange={(event) => { setEmail(event.target.value) }} required />
                        </label>
                    </div>
                </form>
                <div className="modal-action">
                    {
                        showLoadingSpinner ? <button className="btn loading">Loading</button> : <button className="btn" form='loginform' type='submit'>Login</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default LoginModal