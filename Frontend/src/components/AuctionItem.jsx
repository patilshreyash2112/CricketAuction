import React from "react";

function AuctionItem({ auction }) {
  return <li key={auction.auction_id}>{auction.auction_name}</li>;
}

export default AuctionItem;
