import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { useMoveBack } from "../hooks/useMoveBack";

const NotFound = () => {
    const navigate = useNavigate();
    const moveBack = useMoveBack();
    const error = useRouteError();
    console.log(error)

    return (
        <>
            <Result
                status="404"
                title="Không tìm thấy trang"
                subTitle={error.data || error.message}
                extra={
                    <>
                        <Button type="primary" onClick={moveBack}>
                            Trang trước
                        </Button>
                        <Button type="primary" onClick={() => navigate("/")}>
                            Trang chủ
                        </Button>
                    </>

                }
            />
        </>
    );
};

export default NotFound;
