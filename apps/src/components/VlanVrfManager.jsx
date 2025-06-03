import { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/VlanVrfManager.css';

function VlanVrfManager() {
    const [vlans, setVlans] = useState([]);
    const [vrfs, setVrfs] = useState([]);
    const [vlanInput, setVlanInput] = useState({ vlan_id: '', name: '', description: '' });
    const [vrfInput, setVrfInput] = useState({ vrf_name: '', route_distinguisher: '', description: '' });
    const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

    const [showVLANList, setShowVLANList] = useState(false);
    const [showVRFList, setShowVRFList] = useState(false);

    const fetchData = () => {
        api.get('/vlanvrf')
            .then(res => {
                console.log("Data VLAN & VRF berhasil diambil:", res.data);
                setVlans(res.data.vlans || []);
                setVrfs(res.data.vrfs || []);
            })
            .catch(err => {
                console.error("Terjadi kesalahan saat mengambil data:", err);
                showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error');
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showPopup = (message, type = 'success') => {
        setPopup({ show: true, message, type });
        setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleVLANSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting VLAN data:", vlanInput);
        api.post('/vlanvrf/vlan', vlanInput)
            .then(() => {
                showPopup('✅ VLAN berhasil ditambahkan', 'success');
                setVlanInput({ vlan_id: '', name: '', description: '' });
                fetchData();
                setShowVLANList(true);
            })
            .catch(err => showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error'));
    };

    const handleVRFSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting VRF data:", vrfInput);
        api.post('/vlanvrf/vrf', vrfInput)
            .then(() => {
                showPopup('✅ VRF berhasil ditambahkan', 'success');
                setVrfInput({ vrf_name: '', route_distinguisher: '', description: '' });
                fetchData();
                setShowVRFList(true);
            })
            .catch(err => showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error'));
    };

    return (
        <div className="vlan-vrf-container">
            <h2 className="vlan-vrf-title">📡 VLAN & VRF Management</h2>

            <div className="vlan-vrf-forms-container">
                {/* Bagian untuk VLAN */}
                <div className="vlan-vrf-section">
                    <div className="vlan-vrf-header-toggle">
                        <h4>{showVLANList ? '📋 Daftar VLAN' : '➕ Tambah VLAN'}</h4>
                        <button
                            onClick={() => setShowVLANList(!showVLANList)}
                            className={`vlan-vrf-toggle-button ${showVLANList ? 'show-list' : 'show-form'}`}
                        >
                            {showVLANList ? 'Kembali ke Form' : 'Lihat Daftar VLAN'}
                        </button>
                    </div>

                    {showVLANList ? (
                        <div className="vlan-vrf-list-container">
                            <ul className="vlan-vrf-list">
                                {vlans.length > 0 ? (
                                    vlans.map(v => (
                                        <li key={v.id} className="vlan-vrf-list-item">
                                            <strong>{v.vlan_id}</strong> - {v.name} <br />
                                            <small>{v.description}</small>
                                        </li>
                                    ))
                                ) : (
                                    <li className="vlan-vrf-list-item">Tidak ada data VLAN</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <form onSubmit={handleVLANSubmit} className="vlan-vrf-form">
                            <input
                                placeholder="VLAN ID"
                                value={vlanInput.vlan_id}
                                onChange={e => setVlanInput({ ...vlanInput, vlan_id: e.target.value })}
                                required
                                type="number"
                                className="vlan-vrf-input"
                            />
                            <input
                                placeholder="Nama VLAN"
                                value={vlanInput.name}
                                onChange={e => setVlanInput({ ...vlanInput, name: e.target.value })}
                                required
                                className="vlan-vrf-input"
                            />
                            <textarea
                                placeholder="Deskripsi"
                                value={vlanInput.description}
                                onChange={e => setVlanInput({ ...vlanInput, description: e.target.value })}
                                className="vlan-vrf-textarea"
                            />
                            <button type="submit" className="vlan-vrf-button">💾 Simpan VLAN</button>
                        </form>
                    )}
                </div>

                {/* Bagian untuk VRF */}
                <div className="vlan-vrf-section">
                    <div className="vlan-vrf-header-toggle">
                        <h4>{showVRFList ? '📋 Daftar VRF' : '➕ Tambah VRF'}</h4>
                        <button
                            onClick={() => setShowVRFList(!showVRFList)}
                            className={`vlan-vrf-toggle-button ${showVRFList ? 'show-list' : 'show-form'}`}
                        >
                            {showVRFList ? 'Kembali ke Form' : 'Lihat Daftar VRF'}
                        </button>
                    </div>

                    {showVRFList ? (
                        <div className="vlan-vrf-list-container">
                            <ul className="vlan-vrf-list">
                                {vrfs.length > 0 ? (
                                    vrfs.map(v => (
                                        <li key={v.id} className="vlan-vrf-list-item">
                                            <strong>{v.vrf_name}</strong> <br />
                                            <small>{v.route_distinguisher}</small> <br />
                                            <small>{v.description}</small>
                                        </li>
                                    ))
                                ) : (
                                    <li className="vlan-vrf-list-item">Tidak ada data VRF</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <form onSubmit={handleVRFSubmit} className="vlan-vrf-form">
                            <input
                                placeholder="Nama VRF"
                                value={vrfInput.vrf_name}
                                onChange={e => setVrfInput({ ...vrfInput, vrf_name: e.target.value })}
                                required
                                className="vlan-vrf-input"
                            />
                            <input
                                placeholder="Route Distinguisher (RD)"
                                value={vrfInput.route_distinguisher}
                                onChange={e => setVrfInput({ ...vrfInput, route_distinguisher: e.target.value })}
                                required
                                className="vlan-vrf-input"
                            />
                            <textarea
                                placeholder="Deskripsi"
                                value={vrfInput.description}
                                onChange={e => setVrfInput({ ...vrfInput, description: e.target.value })}
                                className="vlan-vrf-textarea"
                            />
                            <button type="submit" className="vlan-vrf-button">💾 Simpan VRF</button>
                        </form>
                    )}
                </div>
            </div>

            {/* Pop-up notifikasi */}
            {popup.show && (
                <div className="vlan-vrf-popup-overlay">
                    <div className={`vlan-vrf-popup ${popup.type}`}>
                        {popup.type === 'success' ? (
                            <>
                                <div className="vlan-vrf-popup-icon">&#10004;</div>
                                <div className="vlan-vrf-popup-title">Sukses</div>
                                <div className="vlan-vrf-popup-message">
                                    <span className="vlan-vrf-popup-message-icon">&#10004;</span> {popup.message}
                                </div>
                                <button
                                    onClick={() => setPopup({ ...popup, show: false })}
                                    className="vlan-vrf-popup-button"
                                >Tutup</button>
                            </>
                        ) : (
                            <>
                                <div className="vlan-vrf-popup-icon">&#10006;</div>
                                <div className="vlan-vrf-popup-title">Error</div>
                                <div className="vlan-vrf-popup-message">
                                    {/* HAPUS SPAN IKON DI SINI */}
                                    {/* <span className="vlan-vrf-popup-message-icon">&#10006;</span> */}
                                    {popup.message}
                                </div>
                                <button
                                    onClick={() => setPopup({ ...popup, show: false })}
                                    className="vlan-vrf-popup-button"
                                >Tutup</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VlanVrfManager;