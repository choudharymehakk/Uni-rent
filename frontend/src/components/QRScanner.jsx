import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

const QRScanner = () => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

        scanner.render(async (decodedText) => {
            const data = JSON.parse(decodedText);

            const { transaction_id, action } = data;

            if (action === "pickup") {
                await supabase
                    .from("transactions")
                    .update({ status: "rented" })
                    .eq("id", transaction_id);
            }

            if (action === "return") {
                await supabase
                    .from("transactions")
                    .update({ status: "returned" })
                    .eq("id", transaction_id);

                // ALSO update item availability
                const { data: txn } = await supabase
                    .from("transactions")
                    .select("item_id")
                    .eq("id", transaction_id)
                    .single();

                await supabase
                    .from("items")
                    .update({ availability: "available" })
                    .eq("id", txn.item_id);
            }

            alert("Status updated successfully!");
            scanner.clear();
        });

        return () => scanner.clear();
    }, []);

    return <div id="reader"></div>;
};

export default QRScanner;