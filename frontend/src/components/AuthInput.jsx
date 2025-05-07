const AuthInput = ({ label, type, value, onChange, id, placeholder }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
    </div>
);

export default AuthInput;
