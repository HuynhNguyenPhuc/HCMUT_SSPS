import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoAlertFill } from "react-icons/go";

function ConfigArea({ support_function, num_pages }){

    const [data, setData] = useState([]);
    const [validation, setValidation] = useState(true);
    const [alertContent, setContent] = useState('');

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}/print/getInfoPrinter`)
          .then((response) => {
            setData(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, []);

    const [customEntries, setCustomEntries] = useState({
        'pages': 'd-none',
        'pages_per_sheet': 'd-none',
        'scale': 'd-none'
    });

    const pagePattern = /^([1-9]\d*|[1-9]\d*-[1-9]\d*)(,([1-9]\d*|[1-9]\d*-[1-9]\d*))*$/;

    const validateInput = (input) => {
        let sanitizedValue = input.value.replace(/[^0-9]/g, '');
        sanitizedValue = sanitizedValue.replace(/^0+/, '');
        input.value = sanitizedValue;
        input.setSelectionRange(sanitizedValue.length, sanitizedValue.length);
    };

    const isValidPageFormat = (value) => {
        if (pagePattern.test(value)){
            setValidation(true);
            const pageSpecs = value.split(',');
        
            for (let pageSpec of pageSpecs){
                if (pageSpec.includes('-')) {
                    const [start, end] = pageSpec.split('-').map(Number);
                    if (start > num_pages || end > num_pages){
                        setContent('Bạn đã nhập trang vượt quá số trang của tài liệu!');
                        setValidation(false);
                        break;
                    }
                } 
                else {
                    if (pageSpec > num_pages){
                        setContent('Bạn đã nhập trang vượt quá số trang của tài liệu!');
                        setValidation(false);
                        break;
                    }
                }
            };
        }
        else{
            setContent('Vui lòng nhập đúng định dạng!');
            setValidation(false);
        }
    };

    const customSelection = (id) => {
        let selectTag = document.getElementById(id);
        const idHeader = id.slice(0, -7);

        if (selectTag.value !== 'custom') {
            setCustomEntries({ ...customEntries, [idHeader]: 'd-none' });
        } 
        else {
            const { [idHeader]: __, ...rest } = customEntries;
            setCustomEntries(rest);
        }
    }

    return (
        <>
        <div className = "d-flex justify-content-around p-2">
            <button
                className = "btn fw-medium" 
                onClick = {support_function}
                style = {{ 
                    backgroundColor: 'rgba(100, 168, 231, 1)',
                    color: 'white'
                }}
            >
                Xác nhận thông số in
            </button>
            <Link
                className = "btn btn-danger fw-medium"
                to='/print'
            >
                Quay lại
            </Link>
        </div>
        <div className = "row p-2">
            <div className = "col">
                Máy in
            </div>
            <select className="col form-select" id="device-select">
                <option value="" disabled selected hidden>
                    Chọn máy in
                </option>
                {data.map(({ printer_id, name }) => (
                    <option key={printer_id} value={printer_id}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
        <div className = "row p-2">
            <div className = "col">
                Số trang
            </div>
            <select className="col form-select" id = "pages-select" onChange={() => customSelection('pages-select')}>
                <option value="" disabled selected hidden>Chọn trang in</option>
                <option value="All">Toàn bộ</option>
                <option value="Odd">In trang lẻ</option>
                <option value="Even">In trang chẵn</option>
                <option value="custom">Tùy chỉnh</option>
            </select>
        </div>
        <div className = "row px-2">
            <div className = "col"></div>
            <input 
                type='text'
                className={`col form-control ${customEntries['pages']}`}
                id='pages-entry'
                placeholder = 'VD. 1-3,7,9-15'
                onBlur={(event) => isValidPageFormat(event.target.value)}
            />
        </div>
        <div className = {`row p-2 ${validation?'d-none':''}`}>
            <div className = "col"></div>
            <div class="col alert alert-danger">
                <span><GoAlertFill style={{ width: '0.9em', height: '0.9em' }}/></span>
                <span>{' ' + alertContent}</span>
            </div>
        </div>
        <div className = "row p-2">
            <div className = "col">
                Mặt in
            </div>
            <select className="col form-select" id = "side-select">
                <option value="" disabled selected hidden>Mặt in</option>
                <option value="1">Một mặt</option>
                <option value="2">Hai mặt</option>
            </select>
        </div>
        <div className = "row p-2">
            <div className = "col">
                Khổ giấy
            </div>
            <select className="col form-select" id = "page_size-select"> 
                <option value="" disabled selected hidden>Khổ giấy</option>
                <option value="4">A4</option>
                <option value="3">A3</option>
            </select>
        </div>
        <div className="row p-2">
            <div className='col'>
                Hướng in
            </div>
            <select className="col form-select" id = "orientation-select">
                <option value="" disabled selected hidden>Hướng in</option>
                <option value="portrait">Dọc</option>
                <option value="landscape">Ngang</option>
            </select>
        </div>
        <div className="row p-2">
            <div className='col'>
                Số trang/1 giấy in
            </div>
            <select className="col form-select" id = "pages_per_sheet-select" onChange={() => customSelection('pages_per_sheet-select')}>
                <option value="" disabled selected hidden>Số trang/1 giấy in</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="custom">Tùy chỉnh</option>
            </select>
        </div>
        <div className = "row px-2">
            <div className = "col"></div>
            <input 
                type='text'
                className={`col form-control ${customEntries['pages_per_sheet']}`}
                id='pages_per_sheet-entry'
                placeholder = 'VD. 5, 7'
                onInput={(event) => validateInput(event.target)}
            />
        </div>
        <div className="row p-2">
            <div className='col'>
                Tỷ lệ
            </div>
            <select className="col form-select" id = "scale-select" onChange={() => customSelection('scale-select')}>
                <option value="" disabled selected hidden>Tỷ lệ</option>
                <option value="100">Mặc định</option>
                <option value="custom">Tùy chỉnh</option>
            </select>
        </div>
        <div className = "row px-2">
            <div className = "col"></div>
            <input 
                type='text'
                className={`col form-control ${customEntries['scale']}`}
                id='scale-entry'
                placeholder = 'VD. 75'
                onInput={(event) => validateInput(event.target)}
            />
        </div>
        </>
    );
}

export default ConfigArea;