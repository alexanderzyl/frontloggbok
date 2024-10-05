import {message} from "antd";

export const navigateToPublicPoi = (shortId) => {
    window.open(`/p/${shortId}`, '_blank');
};

export const navigateToEditFlyer = (shortId) => {
    window.open(`/edit/${shortId}`, '_blank');
};

export const handleCopyPoiLink = (shortId) => {
    const link = `${window.location.origin}/p/${shortId}`;
    navigator.clipboard.writeText(link).then(
        () => {
            message.success('Link copied to clipboard!').then();
        },
        (err) => {
            message.error('Failed to copy link').then();
        }
    );
};