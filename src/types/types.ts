type EnvVar = string | undefined;

type Token = string | null;

interface ImageIndexer {
    id: string;
    search_text: string;
    [key: string]: string;
}

interface ImageData {
    id: string;
    author: string;
    camera: string;
    tags: string;
    cropped_picture: string;
    full_picture: string;
    [key: string]: any;
}

interface AgileApiResponse {
    pictures: ImageIndexer[];
    page: number;
    pageCount: number;
    hasMore: boolean;
}
