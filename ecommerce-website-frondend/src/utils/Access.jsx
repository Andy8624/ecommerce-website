import { useEffect, useState } from 'react';
import { Result } from "antd";
import { useSelector } from 'react-redux';

// function getPathFromUrl(url) {
//     return url.split(/[?#]/)[0];
// }

// export const API_LIST = {
//     APP_DETAIL: {
//         // method: API_URLS..g.method,
//         // path: getPathFromUrl()
//     },
// }

const Access = (props) => {
    // Set default: hideChildren = false => vẫn render children
    // hideChildren = true => ko render children, ví dụ hide button (button này check quyền)
    const { permission, hideChildren = false } = props;
    const [allow, setAllow] = useState(false);

    const permissions = useSelector(state => state.account.user.role.permissions);

    useEffect(() => {
        if (permissions?.length) {
            const check = permissions.find(item => {
                return item.permission.apiPath === permission.apiPath
                    && item.permission.method === permission.method
                    && item.permission.module === permission.module;
            });
            setAllow(Boolean(check));
        }
    }, [permissions, permission]);
    // console.log("allow", allow)
    return (
        <>
            {allow === true || import.meta.env.VITE_ACL_ENABLE === 'false' ?
                <>{props.children}</>
                :
                <>
                    {hideChildren === false ?
                        <Result
                            status="403"
                            title="Truy cập bị từ chối"
                            subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
                        />
                        :
                        null
                    }
                </>
            }
        </>
    );
}

export default Access;
