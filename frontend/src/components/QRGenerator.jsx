import { QRCodeCanvas } from "qrcode.react";

const QRGenerator = ({ transactionId, action }) => {
    const qrData = JSON.stringify({
        transaction_id: transactionId,
        action: action, // pickup OR return
    });

    return (
        <div style={{ textAlign: "center", color: "white" }}>
            <h3>{action === "pickup" ? "Show this to receiver" : "Show this to owner"}</h3>
            <QRCodeCanvas value={qrData} size={200} />
        </div>
    );
};

export default QRGenerator;