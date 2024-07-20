
import PacmanLoader from "react-spinners/PacmanLoader";
const LoadingComponent = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    return (
        <div style={style}>
            <PacmanLoader color="#51e663" />
        </div>
    )
}

export default LoadingComponent