# LoopFi Architecture Diagram

This document contains the visual architecture diagram for LoopFi - AI-Powered DeFi Savings Platform on Celo.

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React + Vite App] --> B[EVM Wallet]
        A --> C[Tailwind UI]
        A --> D[Framer Motion]
        A --> E[Zustand State]
    end
    
    subgraph "Backend Layer"
        F[Node.js + Express] --> G[MongoDB]
        F --> H[Celo RPC]
        F --> I[Socket.io]
        F --> J[Swagger Docs]
    end
    
    subgraph "AI Layer"
        K[Hugging Face AI] --> L[Financial Advisor]
        K --> M[Behavioral Analyzer]
        K --> N[Savings Predictor]
    end
    
    subgraph "Blockchain Layer"
        O[Celo Network] --> P[SavingsVault.sol]
        O --> Q[GroupVault.sol]
        O --> R[StakingVault.sol]
        O --> S[AdvisorNFT.sol]
    end
    
    subgraph "Mobile-First"
        T[Celo Mobile] --> O
    end
    
    subgraph "External Services"
        U[MetaMask] --> B
        V[WalletConnect] --> B
        W[Celo Explorer] --> O
    end
    
    A --> F
    F --> K
    F --> O
    O --> T
    
    style A fill:#61dafb
    style F fill:#68d391
    style K fill:#9f7aea
    style O fill:#f6ad55
    style T fill:#f56565
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant BC as Celo Blockchain
    participant AI as AI Service

    U->>F: Connect Wallet
    F->>B: Authenticate User
    B->>DB: Store User Data
    
    U->>F: Create Savings Goal
    F->>B: Create Goal Request
    B->>DB: Store Goal
    B->>BC: Deploy Smart Contract
    BC-->>B: Contract Address
    B-->>F: Goal Created
    
    U->>F: Make Contribution
    F->>B: Contribution Request
    B->>BC: Execute Transaction
    BC-->>B: Transaction Confirmed
    B->>DB: Update Goal Progress
    B-->>F: Progress Updated
    
    F->>AI: Request Financial Advice
    AI-->>F: Personalized Recommendations
```

## Component Architecture

```mermaid
graph TD
    subgraph "Frontend Components"
        A[App.jsx] --> B[Layout Components]
        A --> C[Page Components]
        A --> D[UI Components]
        
        B --> E[Navigation]
        B --> F[Sidebar]
        B --> G[TopNav]
        
        C --> H[Dashboard]
        C --> I[Goals]
        C --> J[Groups]
        C --> K[Staking]
        
        D --> L[Forms]
        D --> M[Charts]
        D --> N[Modals]
    end
    
    subgraph "State Management"
        O[Zustand Stores] --> P[Auth Store]
        O --> Q[Goals Store]
        O --> R[Groups Store]
        O --> S[Notifications Store]
    end
    
    subgraph "Services"
        T[API Service] --> U[Goals API]
        T --> V[Groups API]
        T --> W[Staking API]
        
        X[Wallet Service] --> Y[Mock Implementation]
        Z[Staking Service] --> AA[Mock Implementation]
    end
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ GOAL : creates
    USER ||--o{ GROUP_MEMBER : joins
    GOAL ||--o{ CONTRIBUTION : has
    GROUP ||--o{ GROUP_MEMBER : contains
    GROUP ||--o{ CONTRIBUTION : receives
    
    USER {
        string address PK
        string network
        number balance
        date createdAt
        date lastSynced
    }
    
    GOAL {
        string _id PK
        string user FK
        string name
        string description
        number targetAmount
        number currentAmount
        string category
        date deadline
        number apy
        number yieldEarned
        boolean isCompleted
        string contractAddress
    }
    
    GROUP {
        string _id PK
        string name
        string description
        number targetAmount
        number currentAmount
        string creator FK
        date deadline
        number maxMembers
        string status
    }
    
    GROUP_MEMBER {
        string _id PK
        string groupId FK
        string user FK
        number totalContributed
        date joinedAt
        string status
    }
    
    CONTRIBUTION {
        string _id PK
        string goalId FK
        string groupId FK
        string user FK
        number amount
        string description
        string txId
        date createdAt
    }
```

## API Architecture

```mermaid
graph TB
    subgraph "REST API Endpoints"
        A[Authentication] --> B[POST /auth/login]
        A --> C[POST /auth/logout]
        
        D[Goals] --> E[GET /goals]
        D --> F[POST /goals]
        D --> G[PUT /goals/:id]
        D --> H[DELETE /goals/:id]
        
        I[Groups] --> J[GET /groups]
        I --> K[POST /groups]
        I --> L[PUT /groups/:id]
        I --> M[POST /groups/:id/join]
        
        N[Staking] --> O[GET /staking/pools]
        N --> P[POST /staking/stakes]
        N --> Q[PUT /staking/stakes/:id]
        
        R[DeFi] --> S[GET /defi/dashboard]
        R --> T[GET /defi/wallet/:address]
        R --> U[GET /defi/vaults]
    end
    
    subgraph "WebSocket Events"
        V[Real-time Updates] --> W[goal:progress]
        V --> X[group:contribution]
        V --> Y[staking:reward]
        V --> Z[notification:new]
    end
```

## Security Architecture

```mermaid
graph TB
    subgraph "Authentication & Authorization"
        A[JWT Tokens] --> B[User Authentication]
        A --> C[API Authorization]
        
        D[Rate Limiting] --> E[Request Throttling]
        D --> F[Abuse Prevention]
    end
    
    subgraph "Data Protection"
        G[Input Validation] --> H[Request Sanitization]
        G --> I[SQL Injection Prevention]
        
        J[Helmet Middleware] --> K[Security Headers]
        J --> L[XSS Protection]
    end
    
    subgraph "Blockchain Security"
        M[Smart Contract Audits] --> N[Code Review]
        M --> O[Security Testing]
        
        P[Non-custodial Design] --> Q[User Asset Control]
        P --> R[No Centralized Storage]
    end
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Frontend Deployment"
        A[Vercel] --> B[React App]
        A --> C[Static Assets]
        A --> D[CDN Distribution]
    end
    
    subgraph "Backend Deployment"
        E[Render] --> F[Node.js API]
        E --> G[Environment Variables]
        E --> H[Auto-scaling]
    end
    
    subgraph "Database"
        I[MongoDB Atlas] --> J[Primary Database]
        I --> K[Backup & Recovery]
        I --> L[Global Distribution]
    end
    
    subgraph "Blockchain"
        M[Celo Testnet] --> N[Smart Contracts]
        M --> O[RPC Endpoints]
        M --> P[Block Explorer]
    end
    
    B --> F
    F --> J
    F --> N
```

## AI Integration Architecture

```mermaid
graph TB
    subgraph "AI Services"
        A[Hugging Face API] --> B[Financial Advisor Model]
        A --> C[Behavioral Analyzer]
        A --> D[Savings Predictor]
    end
    
    subgraph "Data Processing"
        E[User Data] --> F[Financial History]
        E --> G[Savings Patterns]
        E --> H[Risk Profile]
    end
    
    subgraph "Recommendations"
        I[Personalized Advice] --> J[Investment Strategies]
        I --> K[Risk Assessment]
        I --> L[Portfolio Optimization]
    end
    
    F --> B
    G --> C
    H --> D
    
    B --> I
    C --> I
    D --> I
```

## Mobile-First Considerations

```mermaid
graph TB
    subgraph "Mobile Optimization"
        A[Responsive Design] --> B[Mobile UI Components]
        A --> C[Touch Interactions]
        A --> D[Gesture Support]
    end
    
    subgraph "Celo Integration"
        E[Celo Mobile SDK] --> F[Wallet Integration]
        E --> G[Payment Processing]
        E --> H[Transaction Signing]
    end
    
    subgraph "Performance"
        I[Lazy Loading] --> J[Component Optimization]
        I --> K[Bundle Splitting]
        I --> L[Image Optimization]
    end
    
    subgraph "Offline Support"
        M[Service Workers] --> N[Cache Management]
        M --> O[Offline Storage]
        M --> P[Sync on Reconnect]
    end
```

## Future Enhancements

```mermaid
graph TB
    subgraph "Phase 2 Features"
        A[NFT Achievements] --> B[Savings Milestones]
        A --> C[Community Recognition]
        
        D[Advanced Analytics] --> E[Portfolio Tracking]
        D --> F[Yield Optimization]
        
        G[Mobile App] --> H[Native iOS/Android]
        G --> I[Push Notifications]
    end
    
    subgraph "Phase 3 Features"
        J[Cross-chain Support] --> K[Multi-chain Vaults]
        J --> L[Bridge Integration]
        
        M[DAO Governance] --> N[Token Voting]
        M --> O[Protocol Upgrades]
        
        P[Institutional Features] --> Q[Enterprise APIs]
        P --> R[Compliance Tools]
    end
```

This architecture provides a solid foundation for building a mobile-first DeFi savings platform on Celo, with clear separation of concerns and scalable design patterns.