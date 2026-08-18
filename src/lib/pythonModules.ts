/** Python modules written into Pyodide's filesystem once, at startup.
 *
 *  Why a stand-in exists at all: Pyodide runs inside the browser sandbox, so
 *  `requests` has no sockets to use and CORS would block most real hosts anyway.
 *  Asking a learner to paste a real API key into a web page would also be poor
 *  advice. So the network is simulated while the *call shape* — base URL, bearer
 *  token, status codes, JSON body — is exactly what a real private API expects.
 *
 *  Module-level data here survives between test runs, because one Pyodide
 *  instance serves the whole session. Tests call `nunada_api.reset()` in their
 *  `setup` so a POST in one test cannot alter the next. */

export const NUNADA_API_PY = `
"""API tiruan untuk latihan Nunada Academy.

Jaringannya disimulasikan: tidak ada permintaan yang benar-benar keluar dari
peramban. Bentuk pemanggilannya sengaja dibuat sama seperti library "requests",
jadi yang kamu pelajari di sini berlaku juga pada API sungguhan.
"""

BASE_URL = "https://api.nunada.test"
API_KEY = "nunada-rahasia-123"


class Response:
    """Meniru objek respons dari requests."""

    def __init__(self, status_code, data=None):
        self.status_code = status_code
        self._data = data

    @property
    def ok(self):
        return 200 <= self.status_code < 300

    def json(self):
        if self._data is None:
            raise ValueError("respons ini tidak memiliki JSON")
        return self._data

    def __repr__(self):
        return "<Response " + str(self.status_code) + ">"


_AWAL = {
    1: {"id": 1, "nama": "Ani", "nilai": 80},
    2: {"id": 2, "nama": "Budi", "nilai": 65},
    3: {"id": 3, "nama": "Citra", "nilai": 95},
}

_data = dict((k, dict(v)) for k, v in _AWAL.items())
_id_berikut = 4


def reset():
    """Kembalikan data ke keadaan awal. Dipakai oleh pemeriksa antar-tes."""
    global _data, _id_berikut
    _data = dict((k, dict(v)) for k, v in _AWAL.items())
    _id_berikut = 4


def _berwenang(headers):
    if not headers:
        return False
    return headers.get("Authorization", "") == "Bearer " + API_KEY


def _jalur(url):
    if not url.startswith(BASE_URL):
        return None
    return url[len(BASE_URL):] or "/"


def get(url, headers=None):
    if not _berwenang(headers):
        return Response(401, {"error": "kunci API tidak valid"})

    jalur = _jalur(url)
    if jalur == "/siswa":
        return Response(200, {"data": list(_data.values())})

    if jalur and jalur.startswith("/siswa/"):
        bagian = jalur.split("/")
        if len(bagian) == 3 and bagian[2].isdigit():
            sid = int(bagian[2])
            if sid in _data:
                return Response(200, {"data": _data[sid]})
        return Response(404, {"error": "tidak ditemukan"})

    return Response(404, {"error": "tidak ditemukan"})


def post(url, headers=None, json=None):
    global _id_berikut
    if not _berwenang(headers):
        return Response(401, {"error": "kunci API tidak valid"})

    if _jalur(url) != "/siswa":
        return Response(404, {"error": "tidak ditemukan"})

    isi = json or {}
    if "nama" not in isi or "nilai" not in isi:
        return Response(400, {"error": "nama dan nilai wajib diisi"})

    baru = {"id": _id_berikut, "nama": isi["nama"], "nilai": isi["nilai"]}
    _data[_id_berikut] = baru
    _id_berikut += 1
    return Response(201, {"data": baru})
`

/** Runs once per Pyodide instance. Writing the file (rather than exec-ing the
 *  source into a namespace) is what makes `import nunada_api` work from both the
 *  Run button and the checker, in every fresh namespace. */
export const BOOTSTRAP_PY = `
import os
_dir = "/home/pyodide"
os.makedirs(_dir, exist_ok=True)
with open(_dir + "/nunada_api.py", "w") as _f:
    _f.write(${JSON.stringify(NUNADA_API_PY)})

import sys
if _dir not in sys.path:
    sys.path.insert(0, _dir)
os.chdir(_dir)
`
