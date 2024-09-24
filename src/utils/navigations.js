import {message} from "antd";

export const navigateToPublicGroup = (shortId) => {
    window.location.href = `/g/${shortId}`;
};

export const navigateToPublicPoi = (shortId) => {
    window.location.href = `/p/${shortId}`;
};

export const handleCopyLink = (shortId) => {
    const link = `${window.location.origin}/g/${shortId}`;
    navigator.clipboard.writeText(link).then(
        () => {
            message.success('Link copied to clipboard!').then();
        },
        (err) => {
            message.error('Failed to copy link').then();
        }
    );
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

export function handleGotoTable(short_id) {
    window.location.href = `/poiingroup/${short_id}`;
}

export function handleGotoMap(short_id) {
    window.location.href = `/editgroup/${short_id}`;
}