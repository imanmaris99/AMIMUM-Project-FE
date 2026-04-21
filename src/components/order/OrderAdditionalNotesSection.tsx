"use client";

interface OrderAdditionalNotesSectionProps {
  additionalNotes: string;
  onNotesChange: (value: string) => void;
}

const OrderAdditionalNotesSection = ({
  additionalNotes,
  onNotesChange,
}: OrderAdditionalNotesSectionProps) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan Tambahan</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Pesan untuk penjual (opsional)
          </label>
          <textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Contoh: Ambil jam 3 sore, tolong bungkus rapi, dll."
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-colors"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Maksimal 500 karakter</p>
            <span className="text-xs text-gray-400">{additionalNotes.length}/500</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium mb-2">Contoh catatan yang berguna:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>&bull; &ldquo;Ambil jam 3 sore&rdquo;</li>
            <li>&bull; &ldquo;Tolong bungkus rapi&rdquo;</li>
            <li>&bull; &ldquo;Kirim ke alamat kantor&rdquo;</li>
            <li>&bull; &ldquo;Hubungi sebelum kirim&rdquo;</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderAdditionalNotesSection;
