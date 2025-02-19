//cái chỗ để đăng bài
import React, { useState, useEffect } from "react";
import './post.styles.css';
import * as helper from '../../common/helper';
import * as toast from '../../common/toast'
import { fetchInsertPost } from "../../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";


const PostCreate = () => {
    const dispatch = useDispatch();

    const [lstTotal, setLstTotal] = useState([]);
    const [lstCity, setLstCity] = useState([]);
    const [lstDistrict, setLstDistrict] = useState([]);
    const [lstWard, setLstWard] = useState([]);
    //loại bất động sản là mua bán hoặc cho thuê
    const [typeRealEstate, setTypeRealEstate] = useState(0);
    //danh mục là chung cư hay gì gì đó
    const [categoryID, setTypeCategory] = useState(0);

    const [address, setAddress] = useState('');
    const [price, setPrice] = useState();
    const [area, setArea] = useState();
    const [directionID, setDirection] = useState(0);
    //tình trạng pháp lý
    const [paperID, setPaperId] = useState(0);
    const [title, setTitle] = useState('');
    //mô tả
    const [details, setDetail] = useState('');
    //hình ảnh
    const [imageList, setImageList] = useState([]);
    //list ảnh
    const [imageToShowList, setImageToShowList] = useState([]);

    //thành phố
    const [provinceID, setProvinceID] = useState(-1);
    //quận
    const [districtID, setDistrictID] = useState(-1);
    //xã phường
    const [wardID, setWardID] = useState(-1);

    //phòng ngủ
    const [bedrooms, setBedrooms] = useState();
    //phòng tắm
    const [bathrooms, setBathrooms] = useState();


    //hàm xử lí khi nhấn xóa một bức hình
    const handleDeletePhoto = (index) => {
        var temp = [...imageToShowList];
        var tempimg = [...imageList];
        if (index > -1 || index < temp.length) {
            temp.splice(index, 1);
            tempimg.splice(index, 1);
            setImageToShowList(temp);
            setImageList(tempimg);
        }
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let tempImages = [...imageToShowList];
            let tempImageObjLst = [...imageList];
            let lengthFiles = event.target.files.length;
            let i = 0;
            while (i < lengthFiles) {
                var path = (window.URL || window.webkitURL).createObjectURL(event.target.files[i]);
                tempImages.push(URL.createObjectURL(event.target.files[i]));
                tempImageObjLst.push(event.target.files[i]);
                i++;
            }
            setImageToShowList(tempImages);
            setImageList(tempImageObjLst);
        }
    }

    const checkPhoto = () => {
        if (imageToShowList.length == 8) {
            alert("Đã đủ hình")
        }
    }
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=3&fbclid=IwAR1OGuDDmUlDdkyoYmh6umuMeiP9PcIGENaOgFsM0vX_6TAju5D8BLUAz9o')
            .then(function (response) {
                if (response.status !== 200) {
                    console.log('Lỗi, mã lỗi ' + response.status);
                    return;
                }
                // parse response data
                response.json().then(data => {
                    console.log(data)
                    setLstTotal(data);
                })
            })
    }, [])
    useEffect(() => {
        var temp = [];
        lstTotal.forEach((item) => {
            temp.push({
                name: item.name,
                code: item.code
            });
        })
        setLstCity(temp);
    }, [lstTotal])
    const handleOnChangeCurrentCity = (codeCity) => {
        var temp = [];
        setProvinceID(codeCity);
        temp = lstTotal.find((x) => x.code == codeCity).districts;
        setLstDistrict(temp);
    }
    const handleOnChangeCurrentDistric = (codeDistrict) => {
        var temp = [];
        setDistrictID(codeDistrict)
        temp = lstDistrict.find((x) => x.code == codeDistrict).wards;
        setLstWard(temp);
    }
    const handleChangeRealEstate = (type) => {
        setTypeRealEstate(type);
    }
    const handleSubmitCreatePost = () => {
        dispatch(fetchInsertPost({ title, imageList, provinceID, districtID, wardID, address, area, price, bedrooms, bathrooms, directionID, details, paperID, categoryID }))
        // var err = 0;
        // if (typeRealEstate == 0 || categoryID == 0 || provinceID == -1 || districtID == -1 || wardID == -1 || !price || !area || title == '' || area == 0 || price == 0 || details == '') {
        //     err = 1;
        // }
        // if (typeRealEstate == 1 || typeRealEstate == 3) {
        //     if (address == '' || imageList.length < 3)
        //         err = 1;
        // }
        // if (err == 0) {
        //     dispatch(fetchInsertPost({ title, imageList, provinceID, districtID, wardID, address, area, price, bedrooms, bathrooms, directionID, details, paperID, categoryID }))
        // }
        // else {
        //     toast.notifyError("Vui lòng nhập đầy đủ thông tin trường *")
        // }

    }
    return (
        <div id="product_create_app" class="product-create">
            <div>
                <div class="container">
                    <h1>Đăng tin bất động sản miễn phí </h1>
                    <div class="form">
                        <h2>I. Thông tin cơ bản </h2>
                        <div class="form-info">
                            {/* <div class="left"> */}
                            <div>
                                <div class="form-group">
                                    <label class="flex-center">Loại hình<span>*</span>: </label>
                                    <select class="form-input" value={typeRealEstate} onChange={(e) => { handleChangeRealEstate(e.target.value) }}>
                                        <option value="0">Chọn Loại hình</option>
                                        <option value="1">Cần bán</option>
                                        <option value="2">Cần mua</option>
                                        <option value="3">Cho thuê</option>
                                        <option value="4">Cần thuê</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="flex-center">Loại BĐS<span>*</span>: </label>
                                    {(typeRealEstate == 1 || typeRealEstate == 2)
                                        ? (
                                            <select class="form-input" value={categoryID} onChange={(e) => setTypeCategory(e.target.value)}>
                                                <option value="0">Chọn Loại BĐS</option>
                                                <option value="1">Căn hộ/ Chung cư</option>
                                                <option value="2">Nhà ở</option>
                                                <option value="4">Văn phòng/ Mặt bằng kinh doanh</option>
                                                <option value="3">Đất</option>
                                            </select>
                                        ) :
                                        (
                                            <select class="form-input" value={categoryID} onChange={(e) => setTypeCategory(e.target.value)}>
                                                <option value="0">Chọn Loại BĐS</option>
                                                <option value="1">Căn hộ/ Chung cư</option>
                                                <option value="2">Nhà ở</option>
                                                <option value="4">Văn phòng/ Mặt bằng kinh doanh</option>
                                                <option value="5">Nhà trọ</option>
                                            </select>
                                        )}
                                </div>
                                <div class="form-group">
                                    <label>Tỉnh/ Thành phố<span>*</span>: </label>
                                    <select class="form-input" onChange={(e) => handleOnChangeCurrentCity(e.target.value)}>
                                        <option value="-1">Chọn Tỉnh/ Thành phố</option>
                                        {lstCity.map((item) => {
                                            return <option key={item.code} value={item.code}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Quận/ Huyện<span>*</span>: </label>
                                    <select class="form-input" onChange={(e) => handleOnChangeCurrentDistric(e.target.value)}>
                                        <option value="0">Chọn quận/ huyện</option>
                                        {lstDistrict.map((item) => {
                                            return <option key={item.code} value={item.code}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Xã/ Phường<span>*</span>: </label>
                                    <select class="form-input" onChange={(e) => setWardID(e.target.value)}>
                                        <option value="0">Chọn Xã/ Phường</option>
                                        {lstWard.map((item) => {
                                            return <option key={item.code} value={item.code}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                                {
                                    (typeRealEstate == 1 || typeRealEstate == 3) ?
                                        (
                                            <div class="form-group">
                                                <label class="flex-center">Địa chỉ<span>*</span>: </label>
                                                <input type="text" class="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ chi tiết" />
                                            </div>
                                        ) : ''
                                }
                            </div>
                        </div>
                    </div>

                    <div class="form">
                        <h2>II. Thông tin mô tả </h2>
                        <div class="form-info">
                            <div class="left">
                                <div class="form-group">
                                    <label>Giá (VNĐ)<span>*</span>: </label>
                                    <div class="button-group">
                                        <div class="rs">
                                            <div class="c5">
                                                <input type="tel" class="v-money form-input wide" value={price} onChange={(e) => setPrice(helper.validateNumber(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Diện tích (m2)<span>*</span>: </label>
                                    <div class="button-group">
                                        <div class="rs">
                                            <div class="c5">
                                                <input onkeypress="validateNumber(event)" value={area} onChange={(e) => setArea(helper.validateNumber(e.target.value))} class="form-input wide" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="rs">
                                    <div class="c8">
                                        <div class="form-group">
                                            <label class="flex-center">Hướng nhà </label>
                                            <select class="form-input" value={directionID} onChange={(e) => setDirection(e.target.value)} style={{ minWidth: "245px" }}>
                                                <option value="0">Chọn hướng nhà</option>
                                                <option value="1">Đông</option>
                                                <option value="2">Tây</option>
                                                <option value="3">Nam</option>
                                                <option value="4">Bắc</option>
                                                <option value="5">Đông-Bắc</option>
                                                <option value="6">Tây-Bắc</option>
                                                <option value="7">Đông-Nam</option>
                                                <option value="8">Tây-Nam</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="rs">
                                    <div class="c8">
                                        <div class="form-group">
                                            <label>Tình trạng pháp lý </label>
                                            <select class="form-input" value={paperID} onChange={(e) => setPaperId(e.target.value)}>
                                                <option value="0">Tình trạng pháp lý</option>
                                                <option value="1">Sổ đỏ</option>
                                                <option value="2">Sổ hồng</option>
                                                <option value="3">Sổ trắng</option>
                                                <option value="4">Giấy chứng nhận quyền sở hữu</option>
                                                <option value="5">Giấy tờ hợp lệ</option>
                                                <option value="6">Giấy phép xây dựng</option>
                                                <option value="7">Giấy phép kinh doanh</option>
                                                <option value="8">Giấy viết tay</option>
                                                <option value="9">Đang hợp thức hóa</option>
                                                <option value="10">Chưa xác định</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="flex-center">Tên tiêu đề<span>*</span>: </label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề tin đăng" maxlength="99" class="form-input txttitle" />
                                <span class="txtcount">{title.length}/99</span>
                            </div>
                            {
                                (typeRealEstate == 1 && (categoryID == 1 || categoryID == 2))
                                    ? (
                                        <div>
                                            <div class="form-group">
                                                <label class="flex-center">Số phòng ngủ: </label>
                                                <input type="text" value={bedrooms} onChange={(e) => setBedrooms(helper.validateNumber(e.target.value))} placeholder="Nhập số phòng ngủ" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="flex-center">Số phòng tắm: </label>
                                                <input type="text" value={bathrooms} onChange={(e) => setBathrooms(helper.validateNumber(e.target.value))} placeholder="Nhập số phòng tắm" class="form-input" />
                                            </div>
                                        </div>
                                    ) : ''
                            }
                            <div class="form-group">
                                <label>Mô tả<span>*</span>: </label>
                                <textarea style={{ resize: "none" }} class="ck-blurred form-input active ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" value={details} onChange={(e) => setDetail(e.target.value)} />
                            </div>

                        </div>
                    </div>
                    {
                        (typeRealEstate == 1 || typeRealEstate == 3)
                            ? (
                                <div class="form">
                                    <h2>III. Thông tin hình ảnh </h2>
                                    <div class="form-info">
                                        <p class="tips">* Up ít nhất 3 ảnh cho bài đăng để đạt hiệu quả tốt hơn.</p>
                                        <div class="form-images">
                                            <p class="alert alert-info">
                                                Tin đăng có hình ảnh thường hiệu quả hơn 59% tin đăng không có hình ảnh.
                                            </p>
                                            <label className="btn-add-image">
                                                <img src="https://static.homedy.com/src/images/explore/upload.svg" width="32" />
                                                <input type="file" multiple="multiple" accept="image/*" onClick={checkPhoto} onChange={onImageChange} />
                                                Thêm ảnh
                                            </label>
                                            <div class="image-list">
                                                <div dense="" class="rs">
                                                    {imageToShowList.length > 0
                                                        ? imageToShowList.map((item, index) => (
                                                            <div class="c3 image-item" key={index}>
                                                                <img src={item} />
                                                                <button onClick={() => handleDeletePhoto(index)} type="button" class="md-button md-icon-button md-dense btn-close md-theme-default">
                                                                    <div class="md-ripple">
                                                                        <div class="md-button-content">
                                                                            <img src="https://static.homedy.com/src/images/icon/close.svg" />
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        )) : ''}
                                                </div>
                                            </div>
                                            <p class="alert alert-warning">* Lưu ý: Ảnh tải lên không được là ảnh sao chép trên Internet, không chứa logo, thông tin của website khác, kích thước ảnh tối thiểu 300 x 300px</p>
                                        </div>
                                    </div>
                                </div>
                            ) : ''
                    }
                    <button id="cmd_post" onClick={handleSubmitCreatePost} class="btn-submit">ĐĂNG TIN</button>
                </div>
            </div>
        </div >
    )
}
export default PostCreate;