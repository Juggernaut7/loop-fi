// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SavingsBadgeNFT
 * @dev NFT contract for savings milestone achievements
 * @author LoopFi Team
 */
contract SavingsBadgeNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    // Events
    event BadgeMinted(address indexed to, uint256 indexed tokenId, BadgeType badgeType, uint256 milestone);
    event BadgeUpgraded(address indexed to, uint256 indexed tokenId, BadgeType fromType, BadgeType toType);

    // Enums
    enum BadgeType {
        NONE,
        STARTER,      // First savings goal completed
        CONSISTENT,   // 5 goals completed
        DEDICATED,    // 10 goals completed
        MASTER,       // 25 goals completed
        LEGEND,       // 50 goals completed
        GROUP_LEADER, // Created 5 group pools
        SOCIAL_SAVER, // Joined 10 group pools
        YIELD_HUNTER, // Earned 100 CELO in yield
        MILLIONAIRE   // Saved 1000 CELO total
    }

    // Structs
    struct BadgeInfo {
        BadgeType badgeType;
        uint256 milestone;
        uint256 mintedAt;
        string metadataURI;
    }

    // State variables
    mapping(uint256 => BadgeInfo) public badgeInfo;
    mapping(address => mapping(BadgeType => bool)) public userBadges;
    mapping(address => uint256[]) public userTokenIds;
    
    uint256 private _nextTokenId = 1;
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Badge metadata URIs
    mapping(BadgeType => string) public badgeURIs;
    
    // Milestone thresholds
    mapping(BadgeType => uint256) public milestoneThresholds;

    // Modifiers
    modifier onlyAuthorized() {
        require(msg.sender == owner() || isAuthorizedMinter(msg.sender), "SavingsBadgeNFT: Not authorized");
        _;
    }

    constructor() ERC721("LoopFi Savings Badges", "LPFBADGE") Ownable(msg.sender) {
        _setBadgeURIs();
        _setMilestoneThresholds();
    }

    /**
     * @dev Mint a badge to a user
     * @param to User address
     * @param badgeType Type of badge
     * @param milestone Milestone achieved
     * @param metadataURI Metadata URI for the badge
     */
    function mintBadge(
        address to,
        BadgeType badgeType,
        uint256 milestone,
        string memory metadataURI
    ) external onlyAuthorized nonReentrant {
        require(badgeType != BadgeType.NONE, "SavingsBadgeNFT: Invalid badge type");
        require(!userBadges[to][badgeType], "SavingsBadgeNFT: Badge already owned");
        require(_nextTokenId <= MAX_SUPPLY, "SavingsBadgeNFT: Max supply reached");
        require(milestone >= milestoneThresholds[badgeType], "SavingsBadgeNFT: Milestone not reached");

        uint256 tokenId = _nextTokenId++;
        
        badgeInfo[tokenId] = BadgeInfo({
            badgeType: badgeType,
            milestone: milestone,
            mintedAt: block.timestamp,
            metadataURI: metadataURI
        });

        userBadges[to][badgeType] = true;
        userTokenIds[to].push(tokenId);

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit BadgeMinted(to, tokenId, badgeType, milestone);
    }

    /**
     * @dev Upgrade a user's badge to a higher tier
     * @param to User address
     * @param oldBadgeType Current badge type
     * @param newBadgeType New badge type
     * @param milestone New milestone
     * @param metadataURI New metadata URI
     */
    function upgradeBadge(
        address to,
        BadgeType oldBadgeType,
        BadgeType newBadgeType,
        uint256 milestone,
        string memory metadataURI
    ) external onlyAuthorized nonReentrant {
        require(oldBadgeType != BadgeType.NONE, "SavingsBadgeNFT: Invalid old badge type");
        require(newBadgeType != BadgeType.NONE, "SavingsBadgeNFT: Invalid new badge type");
        require(userBadges[to][oldBadgeType], "SavingsBadgeNFT: Old badge not owned");
        require(!userBadges[to][newBadgeType], "SavingsBadgeNFT: New badge already owned");
        require(milestone >= milestoneThresholds[newBadgeType], "SavingsBadgeNFT: Milestone not reached");

        // Find the token ID for the old badge
        uint256 tokenId = _findTokenIdByBadgeType(to, oldBadgeType);
        require(tokenId > 0, "SavingsBadgeNFT: Token not found");

        // Update badge info
        badgeInfo[tokenId] = BadgeInfo({
            badgeType: newBadgeType,
            milestone: milestone,
            mintedAt: block.timestamp,
            metadataURI: metadataURI
        });

        userBadges[to][oldBadgeType] = false;
        userBadges[to][newBadgeType] = true;

        _setTokenURI(tokenId, metadataURI);

        emit BadgeUpgraded(to, tokenId, oldBadgeType, newBadgeType);
    }

    /**
     * @dev Check if user has a specific badge
     * @param user User address
     * @param badgeType Badge type to check
     * @return bool
     */
    function hasBadge(address user, BadgeType badgeType) external view returns (bool) {
        return userBadges[user][badgeType];
    }

    /**
     * @dev Get user's badges
     * @param user User address
     * @return Array of badge types owned
     */
    function getUserBadges(address user) external view returns (BadgeType[] memory) {
        BadgeType[] memory badges = new BadgeType[](10); // Max 10 badge types
        uint256 count = 0;
        
        for (uint256 i = 1; i <= 10; i++) { // Skip NONE (0)
            BadgeType badgeType = BadgeType(i);
            if (userBadges[user][badgeType]) {
                badges[count] = badgeType;
                count++;
            }
        }
        
        // Resize array
        BadgeType[] memory result = new BadgeType[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = badges[i];
        }
        
        return result;
    }

    /**
     * @dev Get user's token IDs
     * @param user User address
     * @return Array of token IDs
     */
    function getUserTokenIds(address user) external view returns (uint256[] memory) {
        return userTokenIds[user];
    }

    /**
     * @dev Get badge info by token ID
     * @param tokenId Token ID
     * @return Badge info
     */
    function getBadgeInfo(uint256 tokenId) external view returns (BadgeInfo memory) {
        require(ownerOf(tokenId) != address(0), "SavingsBadgeNFT: Token does not exist");
        return badgeInfo[tokenId];
    }

    /**
     * @dev Get badge name by type
     * @param badgeType Badge type
     * @return Badge name
     */
    function getBadgeName(BadgeType badgeType) external pure returns (string memory) {
        if (badgeType == BadgeType.STARTER) return "Starter Saver";
        if (badgeType == BadgeType.CONSISTENT) return "Consistent Saver";
        if (badgeType == BadgeType.DEDICATED) return "Dedicated Saver";
        if (badgeType == BadgeType.MASTER) return "Master Saver";
        if (badgeType == BadgeType.LEGEND) return "Legend Saver";
        if (badgeType == BadgeType.GROUP_LEADER) return "Group Leader";
        if (badgeType == BadgeType.SOCIAL_SAVER) return "Social Saver";
        if (badgeType == BadgeType.YIELD_HUNTER) return "Yield Hunter";
        if (badgeType == BadgeType.MILLIONAIRE) return "Millionaire Saver";
        return "Unknown Badge";
    }

    /**
     * @dev Get badge description by type
     * @param badgeType Badge type
     * @return Badge description
     */
    function getBadgeDescription(BadgeType badgeType) external pure returns (string memory) {
        if (badgeType == BadgeType.STARTER) return "Completed your first savings goal!";
        if (badgeType == BadgeType.CONSISTENT) return "Completed 5 savings goals";
        if (badgeType == BadgeType.DEDICATED) return "Completed 10 savings goals";
        if (badgeType == BadgeType.MASTER) return "Completed 25 savings goals";
        if (badgeType == BadgeType.LEGEND) return "Completed 50 savings goals";
        if (badgeType == BadgeType.GROUP_LEADER) return "Created 5 group savings pools";
        if (badgeType == BadgeType.SOCIAL_SAVER) return "Joined 10 group savings pools";
        if (badgeType == BadgeType.YIELD_HUNTER) return "Earned 100 CELO in yield";
        if (badgeType == BadgeType.MILLIONAIRE) return "Saved 1000 CELO total";
        return "Unknown achievement";
    }

    /**
     * @dev Set badge metadata URIs
     */
    function _setBadgeURIs() internal {
        badgeURIs[BadgeType.STARTER] = "https://api.loopfi.app/badges/starter.json";
        badgeURIs[BadgeType.CONSISTENT] = "https://api.loopfi.app/badges/consistent.json";
        badgeURIs[BadgeType.DEDICATED] = "https://api.loopfi.app/badges/dedicated.json";
        badgeURIs[BadgeType.MASTER] = "https://api.loopfi.app/badges/master.json";
        badgeURIs[BadgeType.LEGEND] = "https://api.loopfi.app/badges/legend.json";
        badgeURIs[BadgeType.GROUP_LEADER] = "https://api.loopfi.app/badges/group-leader.json";
        badgeURIs[BadgeType.SOCIAL_SAVER] = "https://api.loopfi.app/badges/social-saver.json";
        badgeURIs[BadgeType.YIELD_HUNTER] = "https://api.loopfi.app/badges/yield-hunter.json";
        badgeURIs[BadgeType.MILLIONAIRE] = "https://api.loopfi.app/badges/millionaire.json";
    }

    /**
     * @dev Set milestone thresholds
     */
    function _setMilestoneThresholds() internal {
        milestoneThresholds[BadgeType.STARTER] = 1;
        milestoneThresholds[BadgeType.CONSISTENT] = 5;
        milestoneThresholds[BadgeType.DEDICATED] = 10;
        milestoneThresholds[BadgeType.MASTER] = 25;
        milestoneThresholds[BadgeType.LEGEND] = 50;
        milestoneThresholds[BadgeType.GROUP_LEADER] = 5;
        milestoneThresholds[BadgeType.SOCIAL_SAVER] = 10;
        milestoneThresholds[BadgeType.YIELD_HUNTER] = 100 ether; // 100 CELO
        milestoneThresholds[BadgeType.MILLIONAIRE] = 1000 ether; // 1000 CELO
    }

    /**
     * @dev Find token ID by badge type for a user
     * @param user User address
     * @param badgeType Badge type
     * @return Token ID
     */
    function _findTokenIdByBadgeType(address user, BadgeType badgeType) internal view returns (uint256) {
        uint256[] memory tokenIds = userTokenIds[user];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (badgeInfo[tokenIds[i]].badgeType == badgeType) {
                return tokenIds[i];
            }
        }
        return 0;
    }

    /**
     * @dev Check if address is authorized to mint badges
     * @param minter Address to check
     * @return bool
     */
    function isAuthorizedMinter(address minter) public view returns (bool) {
        // This would be set by the owner to allow other contracts to mint badges
        // For now, only owner can mint
        return minter == owner();
    }

    /**
     * @dev Add authorized minter (only owner)
     * @param minter Address to authorize
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        // This would be implemented with a mapping of authorized minters
        // For simplicity, we'll keep it owner-only for now
    }

    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
