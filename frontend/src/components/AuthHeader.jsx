const AuthHeader = ({ title }) => (
    <div className="absolute top-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 tracking-wide drop-shadow-md animate-pulse">
            MasteryHub
        </h1>
        {title && (
            <h2 className="text-2xl font-semibold mt-6 text-gray-800">{title}</h2>
        )}
    </div>
);

export default AuthHeader;
