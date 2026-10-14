window.addEventListener("scroll", function () {
    const dauTrang = document.querySelector(".dau-trang");
    if (window.scrollY <= 10) {
        dauTrang.classList.remove("an-header");
        dauTrang.classList.remove("nav-dinh");
    } else {
        dauTrang.classList.add("an-header");
        dauTrang.classList.add("nav-dinh");
    }
});

function locSanPham(loai) {
    const danhSachSanPham = document.querySelectorAll(".san-pham");
    danhSachSanPham.forEach(function (sp) {
        if (loai === "tat-ca" || sp.classList.contains(loai)) {
            sp.style.display = "block";
        } else {
            sp.style.display = "none";
        }
    });
}

function doiAnh(anh) {
    const anhChinh = document.getElementById("anh-chinh");
    const tenSanPham = document.getElementById("ten-san-pham");
    const giaSanPham = document.getElementById("gia-san-pham");
    const giaCu = document.getElementById("gia-cu");
    const giamGia = document.getElementById("giam-gia");
    const moTaNgan = document.getElementById("mo-ta-ngan");

    if (anhChinh) {
        anhChinh.src = anh.src;
    }

    if (tenSanPham) {
        tenSanPham.innerText = anh.dataset.ten || "";
    }

    if (giaSanPham) {
        giaSanPham.innerText = anh.dataset.gia || "";
    }

    if (giaCu) {
        giaCu.innerText = anh.dataset.giaCu || "";
    }

    if (giamGia) {
        giamGia.innerText = anh.dataset.giam || "";
    }

    if (moTaNgan) {
        moTaNgan.innerText = anh.dataset.moTa || "";
    }

    const danhSachAnh = document.querySelectorAll(".anh-nho img");

    danhSachAnh.forEach(function (item) {
        item.classList.remove("anh-dang-chon");
    });

    anh.classList.add("anh-dang-chon");
}

function layGioHang() {
    try {
        return JSON.parse(localStorage.getItem("gioHangBrenna")) || [];
    } catch {
        return [];
    }
}

function luuGioHang(ds) {
    localStorage.setItem("gioHangBrenna", JSON.stringify(ds));
}

function dinhDangTien(gia) {
    return Number(gia).toLocaleString("vi-VN") + "đ";
}

function themVaoGio() {
    const ten = document.getElementById("ten-san-pham")?.textContent.trim();
    const giaText = document.getElementById("gia-san-pham")?.textContent || "";
    const gia = Number(giaText.replace(/[^\d]/g, ""));
    const anhGoc = document.getElementById("anh-chinh");
    const anh = anhGoc ? anhGoc.src : "";
    const soLuong = Number(document.getElementById("so-luong")?.value);

    if (!ten || !gia || !anh || !Number.isInteger(soLuong) || soLuong < 1) {
        alert("Em hãy kiểm tra lại sản phẩm, giá và số lượng nhé!");
        return;
    }

    const ds = layGioHang();
    const ma = ten + "|" + anh;
    const sanPhamCu = ds.find(sp => sp.ma === ma);

    if (sanPhamCu) {
        sanPhamCu.soLuong += soLuong;
    } else {
        ds.push({ ma, ten, gia, hinh: anh, soLuong });
    }

    luuGioHang(ds);
    alert("Đã thêm " + ten + " vào giỏ hàng ♡");
}

function hienThiGioHang() {
    const khung = document.getElementById("danh-sach-gio-hang");
    if (!khung) return;

    const ds = layGioHang();
    const trong = document.getElementById("gio-hang-trong");
    const khuTong = document.getElementById("khu-vuc-tong-tien");
    const tongTien = document.getElementById("tong-tien");

    khung.innerHTML = "";
    let tong = 0;

    if (trong) trong.style.display = ds.length ? "none" : "block";
    if (khuTong) khuTong.style.display = ds.length ? "block" : "none";

    ds.forEach(function (sp, i) {
        tong += sp.gia * sp.soLuong;

        const dong = document.createElement("div");
        dong.className = "dong-san-pham-gio";

        const anh = document.createElement("img");
        anh.src = sp.hinh;
        anh.alt = sp.ten;

        const thongTin = document.createElement("div");
        thongTin.className = "thong-tin-gio";

        const ten = document.createElement("b");
        ten.textContent = sp.ten;

        const gia = document.createElement("p");
        gia.textContent = "Đơn giá: " + dinhDangTien(sp.gia);

        const oSoLuong = document.createElement("input");
        oSoLuong.type = "number";
        oSoLuong.min = "1";
        oSoLuong.step = "1";
        oSoLuong.value = sp.soLuong;
        oSoLuong.setAttribute("aria-label", "Số lượng " + sp.ten);

        const thanhTien = document.createElement("p");
        thanhTien.textContent =
            "Thành tiền: " + dinhDangTien(sp.gia * sp.soLuong);

        oSoLuong.addEventListener("change", function () {
            const soMoi = Number(this.value);
            const dsMoi = layGioHang();

            if (!Number.isInteger(soMoi) || soMoi < 1) {
                hienThiGioHang();
                return;
            }

            if (dsMoi[i]) {
                dsMoi[i].soLuong = soMoi;
                luuGioHang(dsMoi);
            }

            hienThiGioHang();
        });

        const nutXoa = document.createElement("button");
        nutXoa.type = "button";
        nutXoa.textContent = "Xóa";

        nutXoa.addEventListener("click", function () {
            const dsMoi = layGioHang();
            dsMoi.splice(i, 1);
            luuGioHang(dsMoi);
            hienThiGioHang();
        });

        thongTin.append(ten, gia, oSoLuong, thanhTien, nutXoa);
        dong.append(anh, thongTin);
        khung.appendChild(dong);
    });

    if (tongTien) {
        tongTien.textContent = dinhDangTien(tong);
    }
}

function hienThiDonHangDaDat() {
    const khung = document.getElementById("don-hang-da-dat");
    if (!khung) return;

    let danhSachDon = [];

    try {
        danhSachDon = JSON.parse(
            localStorage.getItem("danhSachDonBrenna") || "[]"
        );
    } catch {
        danhSachDon = [];
    }

    khung.innerHTML = "";

    danhSachDon.slice().reverse().forEach(function (don) {
        const theDon = document.createElement("div");
        theDon.className = "don-hang-thanh-cong";

        const tieuDe = document.createElement("h3");
        tieuDe.textContent = "♡ Đơn hàng " + don.maDon;

        const trangThai = document.createElement("p");
        trangThai.className = "trang-thai-don";
        trangThai.textContent = don.trangThai || "Đã ghi nhận";

        const thoiGian = document.createElement("p");
        thoiGian.textContent = "Thời gian đặt: " + don.thoiGian;

        const ngayNhan = document.createElement("p");
        ngayNhan.textContent = "Ngày muốn nhận hàng: " + (don.ngayNhan || "Chưa chọn");

        const ten = document.createElement("p");
        ten.textContent = "Khách hàng: " + don.hoTen;

        const sdt = document.createElement("p");
        sdt.textContent = "Số điện thoại: " + don.sdt;

        const diaChi = document.createElement("p");
        diaChi.textContent = "Địa chỉ: " + don.diaChi;

        theDon.append(tieuDe, trangThai, thoiGian, ngayNhan, ten, sdt, diaChi);

        (don.sanPham || []).forEach(function (sp) {
            const dong = document.createElement("div");
            dong.className = "mon-hang-da-dat";

            const anh = document.createElement("img");
            anh.src = sp.hinh;
            anh.alt = sp.ten;

            const chiTiet = document.createElement("div");
            chiTiet.className = "chi-tiet";

            const tenSP = document.createElement("b");
            tenSP.textContent = sp.ten;

            const soLuong = document.createElement("p");
            soLuong.textContent = "Số lượng: " + sp.soLuong;

            const thanhTien = document.createElement("p");
            thanhTien.textContent =
                "Thành tiền: " + dinhDangTien(sp.gia * sp.soLuong);

            chiTiet.append(tenSP, soLuong, thanhTien);
            dong.append(anh, chiTiet);
            theDon.appendChild(dong);
        });

        const tong = document.createElement("p");
        tong.className = "tong-tien-don";
        tong.textContent = "Tổng tiền: " + dinhDangTien(don.tongTien);

        const loiNhan = document.createElement("p");
        loiNhan.textContent = "Lời nhắn: " + (don.loiNhan || "Không có");
        const nutHuy = document.createElement("button");
        nutHuy.type = "button";
        nutHuy.className = "nut-huy-don";
        nutHuy.textContent = "Hủy đơn hàng";

        nutHuy.addEventListener("click", function () {
            if (!confirm("Em có chắc muốn hủy đơn hàng này không?")) {
                return;
            }

            const dsMoi = JSON.parse(
                localStorage.getItem("danhSachDonBrenna") || "[]"
            ).filter(function (d) {
                return d.maDon !== don.maDon;
            });

            localStorage.setItem(
                "danhSachDonBrenna",
                JSON.stringify(dsMoi)
            );
            const thongBao = document.getElementById("thong-bao");

if (thongBao && thongBao.textContent.includes(don.maDon)) {
    thongBao.textContent = "";
}

            hienThiDonHangDaDat();
        });

        theDon.append(tong, loiNhan, nutHuy);
        khung.appendChild(theDon);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    hienThiGioHang();
    hienThiDonHangDaDat();

    const form = document.getElementById("form-dat-hang");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const ds = layGioHang();

        if (ds.length === 0) {
            alert("Giỏ hàng đang trống. Em hãy chọn sản phẩm trước nhé!");
            return;
        }

        const tongTien = ds.reduce(function (tong, sp) {
            return tong + sp.gia * sp.soLuong;
        }, 0);

        const don = {
            maDon: "BR" + Date.now(),
            hoTen: document.getElementById("ho-ten").value.trim(),
            sdt: document.getElementById("so-dien-thoai").value.trim(),
            email: document.getElementById("email").value.trim(),
            diaChi: document.getElementById("dia-chi").value.trim(),
            ngayNhan: document.getElementById("ngay-nhan").value,
            loiNhan: document.getElementById("loi-nhan").value.trim(),
            sanPham: ds,
            tongTien: tongTien,
            trangThai: "Đã ghi nhận",
            thoiGian: new Date().toLocaleString("vi-VN")
        };

        try {
            const danhSachDon = JSON.parse(
                localStorage.getItem("danhSachDonBrenna") || "[]"
            );

            danhSachDon.push(don);

            localStorage.setItem(
                "danhSachDonBrenna",
                JSON.stringify(danhSachDon)
            );

            luuGioHang([]);
        } catch (loi) {
            alert("Không lưu được đơn hàng. Em hãy thử lại nhé!");
            return;
        }

        hienThiGioHang();
        hienThiDonHangDaDat();

        const thongBao = document.getElementById("thong-bao");

        if (thongBao) {
            thongBao.textContent =
                "♡ Đặt hàng thành công! Mã đơn: " + don.maDon;
            thongBao.style.color = "#ffd700";
            thongBao.style.fontWeight = "bold";
        }

        alert("♡ Brenna đã ghi nhận đơn hàng thành công!");

        form.reset();
    });
});
