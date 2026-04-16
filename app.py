import os

from pathlib import Path
from flask import Flask, url_for
from src import main_bp

def create_app() -> Flask:
    base_dir = Path(__file__).resolve().parent
    app = Flask(
        __name__,
        template_folder=str(base_dir / "templates"),
        static_folder=str(base_dir / "static"),
    )

    @app.context_processor
    def inject_asset_url() -> dict[str, object]:
        def asset_url(filename: str) -> str:
            file_path = base_dir / "static" / filename
            version = int(file_path.stat().st_mtime) if file_path.exists() else 0
            return url_for("static", filename=filename, v=version)

        return {"asset_url": asset_url}

    app.register_blueprint(main_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "3000")), debug=True)
