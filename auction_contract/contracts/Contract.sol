// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Auction {
    address public admin;

    struct AuctionItem {
        string id;
        string name;
        string description;
        uint startBid;
        address highestBidder;
        uint highestBid;
        bool isActive;
    }

    mapping(string => AuctionItem) public auctions;

    event AuctionCreated(string id, string name, uint startBid);
    event NewBid(string auctionId, address bidder, uint bidAmount);
    event AuctionEnded(string auctionId, address winner, uint winningBid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier auctionExists(string memory _auctionId) {
        require(bytes(auctions[_auctionId].id).length != 0, "Auction does not exist");
        _;
    }

    modifier isActiveAuction(string memory _auctionId) {
        require(auctions[_auctionId].isActive, "Auction is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addAuction(string memory _auctionId,string memory _name, string memory _description, uint _startBid) public onlyAdmin {
        require(bytes(auctions[_auctionId].id).length == 0, "Auction ID already exists");

        auctions[_auctionId] = AuctionItem(
            _auctionId,
            _name,
            _description,
            _startBid,
            address(0),
            0,
            true
        );

        emit AuctionCreated(_auctionId, _name, _startBid);
    }

    function placeBid(string memory _auctionId, uint _bidvalue) public auctionExists(_auctionId) isActiveAuction(_auctionId) {
        AuctionItem storage auction = auctions[_auctionId];
        require(_bidvalue > auction.highestBid, "There already is a higher bid");

        auction.highestBidder = msg.sender;
        auction.highestBid = _bidvalue;

        emit NewBid(_auctionId, msg.sender, _bidvalue);

    }

    function endAuction(string memory _auctionId) public onlyAdmin auctionExists(_auctionId) isActiveAuction(_auctionId) {
        AuctionItem storage auction = auctions[_auctionId];
        auction.isActive = false;

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }  
}