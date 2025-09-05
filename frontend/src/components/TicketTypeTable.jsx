import "../styles/pages/ticketTypeTable.css";

export default function TicketTypeTable({ event, selectedTicketByEvent,setSelectedTicketByEvent, onChange }) {
  return (
    <div className="ticket-table-wrap">
      <table className="ticket-table">
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>{" "}
        <thead>
          <tr>
            <th>Type</th>
            <th>Tickets</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {event.tickets.map((ticket, index) => (
            <tr key={index}>
              <td>
                <label className="ticket-radio">
                  <input
                    type="radio"
                    name={`ticketType-${event._id}`}
                    value={index}
                    checked={selectedTicketByEvent[event._id] === index}
                    onChange={() =>
                      setSelectedTicketByEvent((prev) => ({
                        ...prev,
                        [event._id]: index,
                      }))
                    }
                  />
                  {ticket.type}
                </label>
              </td>
              <td className="num">{ticket.count}</td>
              <td className="price">
                {ticket.price === 0 ? "free" : `$${ticket.price}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
