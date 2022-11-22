export const CopyClipboard = (el, setCopySuccess) => {
    const updateClipboard = (newClip) => {
        navigator.clipboard.writeText(newClip).then(
            () => {
                setCopySuccess("Copied!");
            },
            () => {
                setCopySuccess("Copy failed!");
            }
        );
    };

    const copyLink = (el) => {
        if (navigator.permissions) {
            navigator.permissions
                .query({ name: "clipboard-write" })
                .then((result) => {
                    if (result.state === "granted" || result.state === "prompt" || true) {
                        updateClipboard(el.target.innerText);
                    };
                });

        } else {
            updateClipboard(el.target.innerText);
        };
    };

    return copyLink(el);
};

