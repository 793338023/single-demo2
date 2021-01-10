import style from './demo.module.less'
import history from "common/dist/history";
import {Foo} from "components"
interface Props {
    
}

const Demo = (props: Props) => {
    return (
        <div className={style['demo-wrapper']} onClick={()=>{
            history.push("/abc")
        }}>
            123
            <div className={style['demo-ee']}>vvv</div>
            <Foo title="啊实打实"/>
        </div>
    )
}

export default Demo
