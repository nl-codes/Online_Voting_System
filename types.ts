// types.ts or at top of App.tsx or MainContent.tsx
export interface Election {
    id: number;
    title: string;
    position: string;
    description: string;
    start_time: string;
    end_time: string;
  }
  
  export interface Candidate {
    id: any;
    electionId: number;
    full_name: string;
    saying: string;
    photo: File | null; // not string
  }
  
  
  
  